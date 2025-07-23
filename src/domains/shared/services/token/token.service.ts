import { inject, Injectable } from "@angular/core";
import { CryptoService } from "../crypto/crypto.service";
import { JwtHelperService } from '@auth0/angular-jwt';
// Define the TokenResponse interface if not already imported
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
// Define the User interface if not already imported
interface User {
  id: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class TokenService {

  private readonly USER_KEY = 'user_data';
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token_secure';

  private readonly jwtHelper = inject(JwtHelperService);
  private readonly cryptoService = inject(CryptoService);

  saveTokens(tokens: TokenResponse): void {
    // Chiffrement des tokens avant stockage
    const encryptedAccess = this.cryptoService.encrypt(tokens.accessToken);
    const encryptedRefresh = this.cryptoService.encrypt(tokens.refreshToken);

    // Stockage sécurisé
    localStorage.setItem(this.ACCESS_TOKEN_KEY, encryptedAccess);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedRefresh);

    const user = this.decodeToken(tokens.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getAccessToken(): string | null {
    const encrypted = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    return encrypted ? this.cryptoService.decrypt(encrypted) : null;
  }

  getRefreshToken(): string | null {
    const encrypted = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return encrypted ? this.cryptoService.decrypt(encrypted) : null;
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }

  private decodeToken(token: string): User {
    const decoded = this.jwtHelper.decodeToken(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles || []
    };
  }

  // ... autres méthodes
}
