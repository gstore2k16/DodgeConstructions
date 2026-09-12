import { Environment } from './environment.interface';

// UAT config — points at the staging API for pre-production verification.
export const environment: Environment = {
  production: false,
  environmentName: 'uat',
  apiUrl: 'https://nikhilvijay.com/api/items.json',
  enableLogging: true
};
