import { Injectable } from "@angular/core";
import { CategoryGateway } from "./gategory-gateway";
import { ICategory } from "./http-category-service";
import { Observable, of } from "rxjs";
import { Category, CategoryAddModel } from "@domains/shared/models/category.model";

@Injectable()
export class InMemoryCategoryService implements CategoryGateway, ICategory {

  categories: Record<string, Category> = {
    '001': { id: 1, name: 'Name 1', description: 'Description 1', uniqueCode: 'qdids-fwfgw-001' },
    '002': { id: 2, name: 'Name 2', description: 'Description 2', uniqueCode: 'ouhfe-fwfgw-002' },
    '003': { id: 3, name: 'Name 3', description: 'Description 3', uniqueCode: 'qdids-fhthj-003' },
    '004': { id: 4, name: 'Name 4', description: 'Description 4', uniqueCode: 'xcbgf-fwfgw-004' },
    '005': { id: 5, name: 'Name 5', description: 'Description 5', uniqueCode: 'qdids-aohde-005' },
    '006': { id: 6, name: 'Name 6', description: 'Description 6', uniqueCode: 'qdids-mnbht-006' }
  };

  search<Category>(): Observable<Category[]> {
    return of(Object.values(this.categories));
  }

  getAllWithPagination(): Observable<unknown> {
    return of(1);
  }

  getUnSupportedMethod(id: number): Observable<Category> {
    throw new Error("Method not implemented.");
  }

  getByuniqueCode(categoryUniqueCode: string): Observable<Category> {
    const oCategorie = Object.values(this.categories).find(c => c.uniqueCode === categoryUniqueCode);
    return of(oCategorie!);
  }

  put<Category>(id: string, body: unknown): Observable<Category> {
    console.log(body)
    const category = Object.values(this.categories).find(c => c.uniqueCode === id);
    return of(category!);
  }

  post<Category>(body: unknown): Observable<Category> {
    const model: Category = {
      id: 7,
      name: (body as CategoryAddModel).name,
      description: (body as CategoryAddModel).description,
      uniqueCode: 'lopij-hygtr-007'
    };
    return of(model);
  }

  get<Category>(): Observable<Category> {
    const category = Object.values(this.categories).find(c => c.name === 'Name 1');
    return of(category!);
  }

  delete<Category>(): Observable<Category> {
    throw new Error("Method not implemented.");
  }

}
