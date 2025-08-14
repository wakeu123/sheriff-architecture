import { Injectable } from '@angular/core';
import { BaseHttpService } from '@domains/shared/services/base/base-http.service';
import { environment } from '@environments/environment.development';
import { ProductRequest, ProductResponse } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService extends BaseHttpService {

  override baseUrl = environment.apiUrl as string;

  override endpoint = 'products';

  create(model: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.getFullUrl()}/`, model);
  }
}
