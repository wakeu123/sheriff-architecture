import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ISearch {
  search<T>(): Observable<T[]>;
}

export interface IGet {
  get<T>(params?: HttpParams, headers?: HttpHeaders): Observable<T>;
}

export interface IPost {
  post<T>(body: unknown, headers?: HttpHeaders): Observable<T>;
}

export interface IPut {
  put<T>(body: unknown, headers?: HttpHeaders): Observable<T>;
}

export interface IDelete {
  delete<T>(params: HttpParams, headers?: HttpHeaders): Observable<T>;
}
