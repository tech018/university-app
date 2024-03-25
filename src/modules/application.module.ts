import {ValidatedRequest} from 'express-joi-validation';
import {
  DataRequirementsRequestSchema,
  RequirementInfoRequestSchema,
  RequirementsRequestSchema,
  uploadSchema,
} from '../schema/application';
import {Request, Response} from 'express';
import applicationService from '../services/application.service';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import cloudinary from '../config/cloudinary';
import httpStatus from 'http-status';

const getRequirements = async (
  req: ValidatedRequest<RequirementsRequestSchema>,
  res: Response,
) => {
  const {data, email} = req.body;
  console.log('data blink', data);
  const datablink = await applicationService.getRequirements(data, email);
  if (datablink)
    res
      .status(datablink.code)
      .json({message: datablink.message, redirect: datablink.redirect});
};

const requiremenInfo = async (
  req: ValidatedRequest<RequirementInfoRequestSchema>,
  res: Response,
) => {
  const {email} = req.query;

  console.log('email requirement info', email);
  const response = await applicationService.getRequirementsInfo(email);
  if (response)
    return res.status(response.code).json({
      message: response.message,
      userInfo: response.userInfo,
      redirect: response.redirect,
    });
};

const createApplication = async (
  req: ValidatedRequest<DataRequirementsRequestSchema>,
  res: Response,
) => {
  const {email, plateNumber, applicationType, vehicleType, imageURI} = req.body;
  const data = {email, plateNumber, applicationType, vehicleType, imageURI};
  const response = await applicationService.createApplication(data);
  if (response)
    return res.status(response.code).json({
      message: response.message,
      redirect: response.redirect,
    });
};

function findTextInOCR(textToFind: string, ocrText: string) {
  var returnValue = false;

  if (ocrText.indexOf(textToFind) !== -1) {
    returnValue = true;
  }

  return returnValue;
}

const uploadOfficialReciept = async (req: Request, res: Response) => {
  try {
    const plateNumber: string = req.query.plateNumber as string;

    if (req.file) {
      const b64: string = Buffer.from(req.file.buffer).toString('base64');
      let dataURI: string = ('data:' +
        req.file.mimetype +
        ';base64,' +
        b64) as string;

      const {buffer} = req.file;

      const {
        data: {text},
      } = await Tesseract.recognize(buffer, 'eng', {
        logger: m => console.log(m),
      });

      console.log('text', text);

      if (text.includes(plateNumber)) {
        cloudinary.uploader.upload(
          dataURI,
          {public_id: 'tau_file'},
          function (error: any, result: any) {
            console.log('result', result);
            return res.status(httpStatus.CREATED).json({
              imageURI: result.secure_url,
              message: 'Successfully uploaded image',
              redirect: 4,
            });
          },
        );
      } else {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `Cannot find Plate Number: ${plateNumber} in this image, Make sure plate number is included in this image`,
        });
      }
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: `Image file upload not found`,
      });
    }
  } catch (error) {
    console.log('error', error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({message: 'Something wrong in this app'});
  }
};

export default {
  getRequirements,
  requiremenInfo,
  createApplication,
  uploadOfficialReciept,
};
