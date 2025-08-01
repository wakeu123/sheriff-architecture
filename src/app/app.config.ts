import { provideRouter } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { MyPreset } from './my-preset';
import { providePrimeNG } from 'primeng/config';
import localeFr from "@angular/common/locales/fr";
import { MessageService, ConfirmationService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';

registerLocaleData(localeFr, 'fr-Fr');

export const appConfig: ApplicationConfig = {
  providers: [
    DialogService,
    MessageService,
    JwtHelperService,
    ConfirmationService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },

    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    // importProvidersFrom([ToastModule]),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          prefix: 'p',
          darkModeSelector: 'my-app-dark',
          cssLayer: false
        }
      }
    })
  ],
};
