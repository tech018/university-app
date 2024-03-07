import httpStatus from 'http-status';
import Requirements from '../models/requirements';

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
    console.log('destracted', destracted);
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
        redirect: 'AUTHLOGINSCREEN',
      };
    } else {
      return {
        message: `error store driver's license`,
        code: httpStatus.BAD_REQUEST,
        redirect: 'AUTHLOGINSCREEN',
      };
    }
  } catch (error) {
    console.log('error', error);
    return {
      message: error,
      code: httpStatus.INTERNAL_SERVER_ERROR,
      redirect: 'AuthErrorScreen',
    };
  }
};

export default {
  getRequirements,
};
