import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

// Classe utilitaire pour les opérations HTTP
export class HttpHelper {
  readonly http = inject(HttpClient);

  constructor(private baseUrl: string, private endpoint: string) {}

  getFullUrl(): string {
    return `${this.baseUrl}/${this.endpoint}`;
  }

  search<T>(): Observable<T[]> {
    return this.http.get<T[]>(this.getFullUrl());
  }

  get<T>(params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(this.getFullUrl(), { params, headers });
  }

  post<T>(body: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.getFullUrl()}`, body, { headers });
  }

  put<T>(body: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.getFullUrl()}`, body, { headers });
  }

  delete<T>(params: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.getFullUrl()}`, { params, headers });
  }
}
