import axios, { type AxiosRequestConfig, type Method } from 'axios';

const apiBuilder = (
  endPoint: string,
  method: Method = 'GET',
  baseConfig: AxiosRequestConfig = {},
) => {
  const stable = {
    endPoint,
    method,
    baseConfig: { ...baseConfig },
  };

  const execute = async (override: AxiosRequestConfig = {}) => {
    const config: AxiosRequestConfig = {
      method: stable.method,
      url: stable.endPoint,
      ...stable.baseConfig,
      ...override,
    };

    const response = await axios(config);
    return response.data;
  };

  const key = (extraKey?: unknown) => [
    stable.method,
    stable.endPoint,
    stable.baseConfig?.params || null,
    extraKey ?? null,
  ];

  return { key, execute };
};

export default apiBuilder;