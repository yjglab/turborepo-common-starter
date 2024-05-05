import { Config } from './config.interface';

export const GLOBAL_CONFIG: Config = {
  nest: {
    port: 3040,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Api Docs',
    description: 'Api Docs Description.',
    version: '1',
    path: '/api',
  },
};
