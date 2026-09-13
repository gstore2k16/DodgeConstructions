/** Shape shared by every environment config (see environment*.ts), swapped in at build time via angular.json fileReplacements. */
export interface Environment {
  production: boolean;
  environmentName: 'local' | 'production';
  apiUrl: string;
  enableLogging: boolean;
}
