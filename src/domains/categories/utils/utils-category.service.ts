import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Category } from "@domains/shared/models/category.model";
import { environment } from "src/environments/environment.development";
import { BaseHttpService } from "@domains/shared/services/base/base-http.service";
import { IDelete, IGet, IPost, ISearch } from "@domains/shared/services/base/i-post.interface";

export interface ICategory extends IGet, ISearch, IPost, IDelete {}

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseHttpService implements ICategory {

  override baseUrl = environment.apiUrl as string;

  override endpoint = 'categories';

  getByuniqueCode(categoryUniqueCode: string): Observable<Category> {
    return this.http.get<Category>(`${this.getFullUrl()}/by-code/${categoryUniqueCode}`);
  }
}
