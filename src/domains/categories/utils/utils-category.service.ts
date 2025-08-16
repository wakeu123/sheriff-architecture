import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Category } from "@domains/shared/models/category.model";
import { environment } from "src/environments/environment.development";
import { BaseHttpService } from "@domains/shared/services/base/base-http.service";

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseHttpService {

  override baseUrl = environment.apiUrl as string;

  override endpoint = 'categories';

  create(model: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.getFullUrl()}/`, model);
  }

  getByuniqueCode(categoryUniqueCode: string): Observable<Category> {
    return this.http.get<Category>(`${this.getFullUrl()}/by-code/${categoryUniqueCode}`);
  }
}
