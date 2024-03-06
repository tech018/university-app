import httpStatus from 'http-status';
import Requirements from '../models/requirements';

const getRequirements = async (data: string, email: string) => {
  try {
    const storeblink = await Requirements.create({drLicense: data, email});
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
