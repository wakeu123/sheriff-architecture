import { Injectable } from '@angular/core';
import { BaseHttpService } from '@domains/shared/services/base/base-http.service';
import { ProductRequest, ProductResponse } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class ProductService extends BaseHttpService {

  override baseUrl = environment.apiUrl as string;

  override endpoint = 'categories';

  create(model: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.getFullUrl()}/`, model);
  }

  getByuniqueCode(categoryUniqueCode: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.getFullUrl()}/by-code/${categoryUniqueCode}`);
  }
}
