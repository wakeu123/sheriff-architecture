import { Injectable } from '@angular/core';
import { BaseHttpService } from '@domains/shared/services/base/base-http.service';
import { environment } from 'src/environments/environment.development';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService extends BaseHttpService {

  override baseUrl = environment.apiUrl as string;

  override endpoint = 'products';

  create(model: Product): Observable<Product> {
    return this.http.post<Product>(`${this.getFullUrl()}/`, model);
  }
}
