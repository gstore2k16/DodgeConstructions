import { Environment } from './environment.interface';

// Local development config — serves items from the static JSON asset instead of a real API.
export const environment: Environment = {
  production: false,
  environmentName: 'local',
  apiUrl: '/assets/items.json',
  enableLogging: true,
};
