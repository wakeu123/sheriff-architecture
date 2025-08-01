import { Injectable } from "@angular/core";

@Injectable()
export class CryptoService {
  private readonly encryptionKey: Nullable<string> = null;

  constructor() {
    this.encryptionKey = this.generateSecureKey();
  }

  encrypt(data: string): string {
     // Implémentation réelle utilisant Web Crypto API ou librairie sécurisée
    return btoa(data); // Exemple simplifié - remplacer par une vraie implémentation
  }

  decrypt(encrypted: string): string {
    return atob(encrypted);
  }

  getKey(): string {
    return this.generateSecureKey();
  }

  private generateSecureKey(): string {
    // Génération d'une clé sécurisé
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
