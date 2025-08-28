import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const nextReq = req.clone({
    setHeaders: {
        'Accept-Language': inject(TranslateService).getCurrentLang()
      }
  });

  return next(nextReq);
}
