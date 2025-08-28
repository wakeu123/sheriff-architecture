import { provideRouter } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { MyPreset } from './my-preset';
import { providePrimeNG } from 'primeng/config';
import localeFr from "@angular/common/locales/fr";
import { MessageService, ConfirmationService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from '@domains/shared/interceptors/interceptor-http';

registerLocaleData(localeFr, 'fr-Fr');

export const appConfig: ApplicationConfig = {
  providers: [
    DialogService,
    MessageService,
    JwtHelperService,
    ConfirmationService,

    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      })
    }),
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
