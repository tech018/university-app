import {ValidatedRequest} from 'express-joi-validation';
import {RequirementsRequestSchema} from '../schema/application';
import {Response} from 'express';
import applicationService from '../services/application.service';
const getRequirements = async (
  req: ValidatedRequest<RequirementsRequestSchema>,
  res: Response,
) => {
  const {data} = req.query;
  await applicationService.getRequirements(data);
};

export default {
  getRequirements,
};
