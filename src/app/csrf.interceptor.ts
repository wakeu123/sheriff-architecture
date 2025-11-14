import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  let csrfToken: Nullable<string> = null;

  // Ne pas ajouter le token CSRF pour les requêtes HEAD/OPTIONS
    if (['HEAD', 'OPTIONS'].includes(req.method)) {
      return next(req);
    }

    // Si on a déjà un token, l'utiliser
    if (csrfToken) {
      req = addCsrfToken(req, csrfToken);
      return next(req);
    }

    // Sinon, récupérer un nouveau token avant de faire la requête
    return inject(HttpClient).get(`${environment.apiUrl}/api/auth/csrf`, { responseType: 'text' }).pipe(
      switchMap((response: unknown) => {
        const token = (response as { token: string }).token;
        csrfToken = token;
        req = addCsrfToken(req, csrfToken);
        return next(req);
      }),
      catchError(error => {
        console.error('Failed to get CSRF token', error);
        return throwError(() => error);
      })
    );
  return next(req);
};

 export function addCsrfToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      withCredentials: true,
      setHeaders: {
        'X-XSRF-TOKEN': token
      }
    });
  }

