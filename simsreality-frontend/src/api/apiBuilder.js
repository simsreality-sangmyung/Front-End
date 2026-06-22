import client from './client';

const apiBuilder = (endPoint, method = 'GET', baseConfig = {}) => {
  const stable = {
    endPoint,
    method,
    baseConfig: { ...baseConfig },
  };

  const execute = async (override = {}) => {
    const config = {
      method: stable.method,
      url: stable.endPoint,
      ...stable.baseConfig,
      ...override,
    };

    const response = await client(config);
    return response.data;
  };

  const key = (extraKey) => [
    stable.method,
    stable.endPoint,
    stable.baseConfig?.params ?? null,
    extraKey ?? null,
  ];

  return { key, execute };
};

export default apiBuilder;
