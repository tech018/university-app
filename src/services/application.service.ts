function stringToObject(inputString: string): Record<string, string> {
  return inputString.split('\n').reduce((result, keyValue) => {
    const [key, value] = keyValue.split(':').map(part => part.trim());
    result[key] = value;
    return result;
  }, {} as Record<string, string>);
}

const getRequirements = (data: string) => {
  const resultObject: Record<string, string> = stringToObject(data);

  console.log('microblink data', resultObject);
};

export default {
  getRequirements,
};
