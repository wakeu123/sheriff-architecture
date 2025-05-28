import { provideRouter } from '@angular/router';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { MyPreset } from './my-preset';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    //importProvidersFrom([ButtonModule]),
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
