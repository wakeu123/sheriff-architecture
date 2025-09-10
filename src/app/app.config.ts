import { provideRouter } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApplicationConfig, LOCALE_ID, makeEnvironmentProviders, provideZoneChangeDetection } from '@angular/core';
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

registerLocaleData(localeFr, 'en');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'en' },
    providePrimeNg(),
    provideLanguage(),
    provideRouter(routes),
    provideGlobalService(),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    // importProvidersFrom([ToastModule]),
  ],
};

export function provideGlobalService() {
  return makeEnvironmentProviders([
    DialogService,
    MessageService,
    JwtHelperService,
    ConfirmationService,
  ])
}

export function provideLanguage() {
  return makeEnvironmentProviders([
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      })
    })
  ]);
}

export function providePrimeNg() {
  return makeEnvironmentProviders([
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
  ]);
}
