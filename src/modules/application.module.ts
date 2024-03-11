import {ValidatedRequest} from 'express-joi-validation';
import {
  RequirementInfoRequestSchema,
  RequirementsRequestSchema,
} from '../schema/application';
import {Response} from 'express';
import applicationService from '../services/application.service';
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
  const response = await applicationService.getRequirementsInfo(email);
  if (response)
    return res.status(response.code).json({
      message: response.message,
      userInfo: response.userInfo,
      redirect: response.redirect,
    });
};

export default {
  getRequirements,
  requiremenInfo,
};
