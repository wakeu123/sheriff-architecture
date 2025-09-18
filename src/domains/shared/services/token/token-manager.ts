// token-manager.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {
  private readonly TOKEN_PARTS_KEY = 'token_parts';
  private readonly ORDER_KEY = 'token_order';

  // Découper et stocker le token de manière désordonnée
  storeTokenFragmented(token: string): void {
    // Découper le token en 3 parties (header, payload, signature)
    const parts = this.splitToken(token);

    // Mélanger les parties
    const shuffledParts = this.shuffleArray([...parts]);
    const originalOrder = parts.map((part, index) =>
      shuffledParts.findIndex(p => p === part)
    );

    // Stocker dans le sessionStorage
    sessionStorage.setItem(this.TOKEN_PARTS_KEY, JSON.stringify(shuffledParts));
    sessionStorage.setItem(this.ORDER_KEY, JSON.stringify(originalOrder));
  }

  // Récupérer et réassembler le token
  getReassembledToken(): string | null {
    try {
      const shuffledParts = JSON.parse(
        sessionStorage.getItem(this.TOKEN_PARTS_KEY) || '[]'
      );
      const order = JSON.parse(
        sessionStorage.getItem(this.ORDER_KEY) || '[]'
      );

      if (shuffledParts.length === 0 || order.length === 0) {
        return null;
      }

      // Réassembler dans le bon ordre
      const orderedParts = order.map((index: number) => shuffledParts[index]);
      return orderedParts.join('.');
    } catch {
      return null;
    }
  }

  // Supprimer le token fragmenté
  clearFragmentedToken(): void {
    sessionStorage.removeItem(this.TOKEN_PARTS_KEY);
    sessionStorage.removeItem(this.ORDER_KEY);
  }

  // Vérifier si un token est stocké
  hasToken(): boolean {
    return !!sessionStorage.getItem(this.TOKEN_PARTS_KEY);
  }

  private splitToken(token: string): string[] {
    return token.split('.');
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenManagerService } from './token-manager.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenManager: TokenManagerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Vérifier si la requête nécessite une authentification
    if (this.requiresAuth(request)) {
      const token = this.tokenManager.getReassembledToken();

      if (token) {
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(clonedRequest);
      }
    }

    return next.handle(request);
  }

  private requiresAuth(request: HttpRequest<any>): boolean {
    // Liste des endpoints qui ne nécessitent pas d'authentification
    const publicEndpoints = ['/auth/login', '/auth/register'];

    return !publicEndpoints.some(endpoint =>
      request.url.includes(endpoint)
    );
  }
}
