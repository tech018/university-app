import httpStatus from 'http-status';
import Requirements from '../models/requirements';
import Applications from '../models/application';
import {application} from '../schema/application';
import Tesseract from 'tesseract.js';
import multer from 'multer';
function stringToObject(inputString: string): Record<string, string> {
  return inputString.split('>').reduce((result, keyValue) => {
    const [key, value] = keyValue.split(':').map(part => part.trim());
    result[key] = value;
    return result;
  }, {} as Record<string, string>);
}

const getRequirements = async (data: string, email: string) => {
  try {
    const destracted = stringToObject(data);

    if (destracted.Document_number === null || undefined)
      return {
        code: httpStatus.BAD_REQUEST,
        message: `This is not a driver's license card please scan valid driver's license card`,
      };

    const exist = await Requirements.findAll({
      where: {
        drLicenseNo: destracted.Document_number,
      },
    });

    if (exist.length > 0) {
      return {
        code: httpStatus.BAD_REQUEST,
        message: `License number ${destracted.Document_number} is already in use, please use another driver's license`,
      };
    }

    const storeblink = await Requirements.create({
      fullName: destracted.Full_name,
      address: destracted.Address,
      dateOfBirth: destracted.Date_of_birth,
      drLicenseNo: destracted.Document_number,
      licenseExpiration: destracted.Date_of_expiry,
      gender: destracted.Sex,
      email,
    });
    if (storeblink) {
      return {
        message: `Successfully store driver's license`,
        code: httpStatus.OK,
        redirect: 'DASHBOARDSCREEN',
        data: storeblink,
      };
    } else {
      return {
        message: `error store driver's license`,
        code: httpStatus.BAD_REQUEST,
        redirect: 'AUTHLOGINSCREEN',
      };
    }
  } catch (error) {
    return {
      message: error,
      code: httpStatus.INTERNAL_SERVER_ERROR,
      redirect: 'AuthErrorScreen',
    };
  }
};

const getRequirementsInfo = async (email: string) => {
  const requirement = await Requirements.findOne({where: {email}});
  try {
    if (requirement)
      return {
        code: httpStatus.OK,
        userInfo: requirement,
      };

    return {
      code: httpStatus.NOT_FOUND,
      message: `Driver's info not found`,
    };
  } catch (error) {
    return {
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'General error',
      redirect: 'APPLICATIONERROR ',
    };
  }
};

const createApplication = async (data: application) => {
  try {
    const checkExist = await Applications.findAll({
      where: {
        plateNumber: data.plateNumber,
      },
    });

    if (checkExist.length > 0)
      return {
        code: httpStatus.BAD_REQUEST,
        message: `Plate Number is already in use please use other plateNumber`,
        redirect: 0,
      };

    const storeapp = await Applications.create({
      email: data.email,
      vehicleType: data.vehicleType,
      applicationType: data.applicationType,
      plateNumber: data.plateNumber,
      imageURI: data.imageURI,
    });
    if (storeapp) {
      return {
        message: `Application successfully saved`,
        code: httpStatus.OK,
        redirect: 'REQUIREMENTSCREEN',
      };
    } else {
      return {
        message: `Something wrong with saving your application`,
        code: httpStatus.BAD_REQUEST,
        redirect: 'APPLICATIONERROR',
      };
    }
  } catch (error) {
    return {
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'General error',
      redirect: 'APPLICATIONERROR ',
    };
  }
};

export default {
  getRequirements,
  getRequirementsInfo,
  createApplication,
};
