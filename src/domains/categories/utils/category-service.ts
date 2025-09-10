import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Log } from "@domains/shared/decorators/log.decoraor";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Category } from "@domains/shared/models/category.model";
import { environment } from "src/environments/environment.development";
import { HttpHelper } from "@domains/shared/services/base/http-helpers";
import { IDelete, IGet, IPost, ISearch } from "@domains/shared/services/base/i-post.interface";

export interface ICategory extends IGet, ISearch, IPost, IDelete {}

@Injectable({ providedIn: 'root' })
export class CategoryService implements ICategory {

  private readonly endpoint = 'categories';
  private readonly baseUrl = environment.apiUrl as string;

  private httpHelper = new HttpHelper(this.baseUrl, this.endpoint);

  search<T>(): Observable<T[]> {
    return this.httpHelper.search<T>();
  }

  get<T>(params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.httpHelper.get<T>(params, headers);
  }

  @Log()
  post<Category>(body: unknown, headers?: HttpHeaders): Observable<Category> {
    return this.httpHelper.http.post<Category>(`${this.httpHelper.getFullUrl()}`, body, { headers });
  }

  delete<T>(params: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.httpHelper.delete<T>(params, headers);
  }

  getByuniqueCode(categoryUniqueCode: string): Observable<Category> {
    return this.httpHelper.http.get<Category>(`${this.httpHelper.getFullUrl()}/by-code/${categoryUniqueCode}`);
  }

  getUnSupportedMethod(id: number): Observable<Category> {
    return this.httpHelper.http.get<Category>(`${this.httpHelper.getFullUrl()}/by-id/${id}`);
  }
}
