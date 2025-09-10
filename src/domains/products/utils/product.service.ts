import { Product } from './../data/models/product.model';
import { IDelete, IGet, IPost, ISearch } from "@domains/shared/services/base/i-post.interface";
import { ApiService, PaginationParams } from "@domains/shared/stores/features/pagination-feature";
import { environment } from "src/environments/environment.development";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PaginationResponse } from "@domains/shared/models/pagination-response.model";
import { HttpHelper } from "@domains/shared/services/base/http-helpers";

export interface IProduct extends ApiService<Product>, IGet, ISearch, IPost, IDelete {}

export class ProductService implements IProduct {

  private readonly endpoint = 'products';
  private readonly baseUrl = environment.apiUrl as string;

  private readonly httpHelper = new HttpHelper(this.baseUrl, this.endpoint);

  get<Product>(params?: HttpParams, headers?: HttpHeaders): Observable<Product> {
    return this.httpHelper.get<Product>(params, headers);
  }

  search<Product>(): Observable<Product[]> {
    return this.httpHelper.search<Product>();
  }

  post<Product>(body: unknown, headers?: HttpHeaders): Observable<Product> {
    return this.httpHelper.post<Product>(body, headers);
  }

  delete<Product>(params: HttpParams, headers?: HttpHeaders): Observable<Product> {
    return this.httpHelper.delete<Product>(params, headers);
  }

  getAllWithPagination(params: PaginationParams): Observable<PaginationResponse<Product>> {
    let httpParams = new HttpParams()
      .set('page', params.page?.toString() || '1')
      .set('size', params.size?.toString() || '20');

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    return this.httpHelper.http.get<PaginationResponse<Product>>(this.httpHelper.getFullUrl(), { params: httpParams });
  }

}
