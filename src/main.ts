import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { apiInterceptor } from './interceptors/api.interceptor';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';

// Application entry point: wires up routing (with route params bound as
// component inputs), the HTTP client (with the logging/error interceptor),
// and the global error handler, then bootstraps the root component.
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([apiInterceptor])),
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
    ]
}).catch(err => console.error(err));
