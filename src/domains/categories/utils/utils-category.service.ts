import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Category } from "@domains/shared/models/category.model";
import { environment } from "src/environments/environment.development";
import { BaseHttpService } from "@domains/shared/services/base/base-http.service";
import { IDelete, IGet, IPost, ISearch } from "@domains/shared/services/base/i-post.interface";
import { Log } from "@domains/shared/decorators/log.decoraor";

export interface ICategory extends IGet, ISearch, IPost, IDelete {}

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseHttpService implements ICategory {

  override baseUrl = environment.apiUrl as string;

  override endpoint = 'categories';

  override post<Category>(body: unknown, headers?: HttpHeaders): Observable<Category> {
    return this.http.post<Category>(`${this.getFullUrl()}/create`, body, { headers: headers });
  }

  @Log()
  getByuniqueCode(categoryUniqueCode: string): Observable<Category> {
    return this.http.get<Category>(`${this.getFullUrl()}/by-code/${categoryUniqueCode}`);
  }

  getUnSupportedMethod(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.getFullUrl()}/by-id/${id}`);
  }
}
