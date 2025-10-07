import { Observable } from "rxjs";
import { Category } from '../../shared/models/category.model';
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { InjectionToken } from "@angular/core";

export const CATEGORY_GATEWAY = new InjectionToken<CategoryGateway>('CategoryGateway');

export abstract class CategoryGateway {

  abstract search<Category>(): Observable<Category[]>;

  abstract getAllWithPagination(): Observable<unknown>;

  abstract getUnSupportedMethod(id: number): Observable<Category>;

  abstract getByUniqueCode(categoryUniqueCode: string): Observable<Category>;

  abstract post<Category>(body: unknown, headers?: HttpHeaders): Observable<Category>;

  abstract get<Category>(params?: HttpParams, headers?: HttpHeaders): Observable<Category>;

  abstract delete<Category>(params: HttpParams, headers?: HttpHeaders): Observable<Category>;

  abstract put<Category>(id: string, body: unknown, headers?: HttpHeaders): Observable<Category>;
}
