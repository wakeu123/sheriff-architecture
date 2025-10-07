import { TestBed } from "@angular/core/testing";
import { CATEGORY_GATEWAY, CategoryGateway } from "@domains/categories/utils/gategory-gateway";
import { CategoriesListStore } from "@domains/categories/utils/utils-category-store";
import { InMemoryCategoryService } from "@domains/categories/utils/in-memory-category.service";
import { patchState, StateSignals } from "@ngrx/signals";
import { unprotected } from '@ngrx/signals/testing';

describe('Category-list-component', () => {
  let categoryGateway: InMemoryCategoryService;

  beforeEach(() => {
    categoryGateway = new InMemoryCategoryService();

    TestBed.configureTestingModule({
      providers: [
        CategoriesListStore,
        { provide: CategoryGateway, useValue: categoryGateway },
        { provide: CATEGORY_GATEWAY, useValue: categoryGateway },
      ]
    });
  })

  it('should retrieve categories when store is created', () => {
    categoryGateway.categories = {
      '001': { id: 1, name: 'Name 1', description: 'Description 1', uniqueCode: 'qdids-fwfgw-001' }
    };
    const store = initStore({categories: []});
    store.categories();
    expect(store.categories()).toEqual([{ id: 1, name: 'Name 1', description: 'Description 1', uniqueCode: 'qdids-fwfgw-001' }]);
  });
});

function initStore(partial?: StateSignals<typeof CategoriesListStore>) {
  const store = TestBed.inject(CategoriesListStore);
  patchState(unprotected(store), partial ?? {});
  return store;
}
