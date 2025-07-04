import { provideRouter } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { MyPreset } from './my-preset';
import { providePrimeNG } from 'primeng/config';
import localeFr from "@angular/common/locales/fr";
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';

registerLocaleData(localeFr, 'fr-Fr');

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    DialogService,
    ConfirmationService,

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
