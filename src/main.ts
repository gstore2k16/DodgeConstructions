import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { apiInterceptor } from './interceptors/api.interceptor';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([apiInterceptor])),
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
    ]
}).catch(err => console.error(err));
