import {ValidatedRequest} from 'express-joi-validation';
import {RequirementsRequestSchema} from '../schema/application';
import {Response} from 'express';
import applicationService from '../services/application.service';
const getRequirements = async (
  req: ValidatedRequest<RequirementsRequestSchema>,
  res: Response,
) => {
  const {data} = req.query;
  const datablink = await applicationService.getRequirements(data);
  if (datablink) res.status(datablink.code).json({message: datablink.message});
};

export default {
  getRequirements,
};
