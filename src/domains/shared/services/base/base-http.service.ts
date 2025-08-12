import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export abstract class BaseHttpService {

  readonly http = inject(HttpClient);

  abstract baseUrl: string;

  abstract endpoint: string;

  getFullUrl(): string {
    return `${this.baseUrl}/${this.endpoint}`
  }

  get<T>(params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(this.getFullUrl(), { params, headers });
  }
}
