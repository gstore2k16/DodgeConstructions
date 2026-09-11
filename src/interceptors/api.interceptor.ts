import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  // Clone request to add custom header metadata
  const authReq = req.clone({
    setHeaders: {
      'X-Environment': environment.environmentName,
      'Accept': 'application/json'
    }
  });

  if (environment.enableLogging) {
    console.log(`[HTTP Request] [${environment.environmentName.toUpperCase()}] ${req.method} ${req.urlWithParams}`);
  }

  return next(authReq).pipe(
    tap(() => {
      if (environment.enableLogging) {
        const elapsed = Date.now() - startTime;
        console.log(`[HTTP Response] ${req.method} ${req.url} completed in ${elapsed}ms`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const elapsed = Date.now() - startTime;
      let errorMessage = 'An unexpected HTTP error occurred.';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Backend returned an unsuccessful response code
        errorMessage = `Server Error [Status ${error.status}]: ${error.message || error.statusText}`;
      }

      console.error(`[HTTP Error] [${environment.environmentName.toUpperCase()}] ${req.method} ${req.url} failed in ${elapsed}ms:`, errorMessage, error);

      return throwError(() => new Error(errorMessage));
    })
  );
};
