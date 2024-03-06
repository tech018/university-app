import {ValidatedRequest} from 'express-joi-validation';
import {RequirementsRequestSchema} from '../schema/application';
import {Response} from 'express';
import applicationService from '../services/application.service';
const getRequirements = async (
  req: ValidatedRequest<RequirementsRequestSchema>,
  res: Response,
) => {
  const {data, email} = req.body;

  const datablink = await applicationService.getRequirements(data, email);
  if (datablink)
    res
      .status(datablink.code)
      .json({message: datablink.message, redirect: datablink.redirect});
};

export default {
  getRequirements,
};
