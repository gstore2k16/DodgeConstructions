import { Environment } from './environment.interface';

// Default/production config — used unless a build configuration replaces this file (see angular.json).
export const environment: Environment = {
  production: true,
  environmentName: 'production',
  apiUrl: 'https://timely-florentine-2f5598.netlify.app/assets/items.json',
  enableLogging: false,
};
