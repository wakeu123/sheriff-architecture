import { Observable } from "rxjs";
import { CategoryGateway } from "./gategory-gateway";
import { Log } from "@domains/shared/decorators/log.decoraor";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Category } from "@domains/shared/models/category.model";
import { environment } from "src/environments/environment.development";
import { HttpHelper } from "@domains/shared/services/base/http-helpers";
import { Crud, IGet, ISearch } from "@domains/shared/services/base/i-post.interface";

export interface ICategory extends IGet, ISearch, Crud {}

export class HttpCategoryService implements CategoryGateway, ICategory {

  private readonly endpoint = 'categories';
  private readonly baseUrl = environment.apiUrl as string;

  private httpHelper = new HttpHelper(this.baseUrl, this.endpoint);

  search<Category>(): Observable<Category[]> {
    return this.httpHelper.search<Category>();
  }

  get<Category>(params?: HttpParams, headers?: HttpHeaders): Observable<Category> {
    return this.httpHelper.get<Category>(params, headers);
  }

  @Log()
  post<Category>(body: unknown, headers?: HttpHeaders): Observable<Category> {
    return this.httpHelper.http.post<Category>(`${this.httpHelper.getFullUrl()}`, body, { headers });
  }

  put<Category>(uniqueCode: string, body: unknown, headers?: HttpHeaders): Observable<Category> {
    return this.httpHelper.put<Category>(uniqueCode, body, headers);
  }

  delete<T>(params: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.httpHelper.delete<T>(params, headers);
  }

  getByUniqueCode(categoryUniqueCode: string): Observable<Category> {
    return this.httpHelper.http.get<Category>(`${this.httpHelper.getFullUrl()}/by-code/${categoryUniqueCode}`);
  }

  getUnSupportedMethod(id: number): Observable<Category> {
    return this.httpHelper.http.get<Category>(`${this.httpHelper.getFullUrl()}/by-id/${id}`);
  }

  getAllWithPagination(): Observable<unknown> {
    return this.httpHelper.http.get<unknown>(`${this.httpHelper.getFullUrl()}/with-pagination/${0}/${20}/${'id'}/${'asc'}`);
  }
}
