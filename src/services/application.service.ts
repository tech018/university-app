import httpStatus from 'http-status';

function stringToObject(inputString: string): Record<string, string> {
  return inputString.split('\n').reduce((result, keyValue) => {
    const [key, value] = keyValue.split(':').map(part => part.trim());
    result[key] = value;
    return result;
  }, {} as Record<string, string>);
}

const getRequirements = (data: string) => {
  try {
    const resultObject: Record<string, string> = stringToObject(data);

    console.log('microblink data', resultObject);
    return {
      message: 'success',
      code: httpStatus.OK,
    };
  } catch (error) {
    return {
      message: error,
      code: httpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

export default {
  getRequirements,
};
