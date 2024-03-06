import httpStatus from 'http-status';

function stringToObject(inputString: string) {
  const lines: string[] = inputString.split('\n');
  const info: Record<string, string> = {};

  // Iterate through each line and extract key-value pairs
  lines.forEach(line => {
    // Skip empty lines
    if (!line.trim()) {
      return;
    }

    // Split each line at the colon to separate key and value
    const [key, value] = line.split(':').map(part => part.trim());

    // Add key-value pairs to the object
    info[key] = value;

    return info;
  });
}

const getRequirements = (data: string) => {
  try {
    const resultObject = stringToObject(data);

    console.log('microblink data', resultObject);
    return {
      message: 'success',
      code: httpStatus.OK,
    };
  } catch (error) {
    console.log('microblink data error', error);
    return {
      message: error,
      code: httpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

export default {
  getRequirements,
};
