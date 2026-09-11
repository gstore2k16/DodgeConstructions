import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  public handleError(error: unknown): void {
    const timestamp = new Date().toISOString();
    const envName = environment.environmentName.toUpperCase();

    if (error instanceof HttpErrorResponse) {
      // Backend / HTTP Communications Error
      console.error(
        `[${timestamp}] [GLOBAL_ERROR_HANDLER] [${envName}] HTTP Error Status: ${error.status} ${error.statusText}`,
        `URL: ${error.url}`,
        error
      );
    } else if (error instanceof Error) {
      // Uncaught JS Runtime Exception
      console.error(
        `[${timestamp}] [GLOBAL_ERROR_HANDLER] [${envName}] Runtime Error: ${error.message}`,
        `Stack trace:\n${error.stack}`
      );
    } else {
      // Unknown Error Object
      console.error(`[${timestamp}] [GLOBAL_ERROR_HANDLER] [${envName}] Unknown Error:`, error);
    }
  }
}
