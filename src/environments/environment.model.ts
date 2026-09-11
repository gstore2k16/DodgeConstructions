export interface Environment {
  production: boolean;
  environmentName: 'local' | 'uat' | 'production';
  apiUrl: string;
  enableLogging: boolean;
}
