import { IDelete, IGet, IPost, ISearch } from "@domains/shared/services/base/i-post.interface";
import { ApiService } from "@domains/shared/stores/features/pagination-feature";
import { BaseHttpService } from "@domains/shared/services/base/base-http.service";
import { PaginatedResponse, PaginationParams } from "@domains/shared/state";
import { environment } from "src/environments/environment.development";
import { Product } from "../data/models/product.model";
import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface IProduct extends ApiService<Product>, IGet, ISearch, IPost, IDelete {}

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseHttpService implements IProduct {

  override endpoint = '/products';
  override baseUrl = environment.apiUrl as string;

  getAllWithPagination(params: PaginationParams): Observable<PaginatedResponse<Product>> {
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

    return this.http.get<PaginatedResponse<Product>>(this.getFullUrl(), { params: httpParams });
  }

}
