import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoryComponent } from '@domains/categories/ui/category.component';
import { CategoryFacade } from '@domains/categories/utils/category-fascade';
import { Category } from '@domains/shared/models/category.model';
import { ConfirmService } from '@domains/shared/services/confirm/confirm.service';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { AddHobbiteComponent } from '../../../hobbite/ui-add-hobbite/ui-add-hobbite.component';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoryGateway } from '@domains/categories/utils/gategory-gateway';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  providers: [CategoryFacade, CdkDrag, CdkDropList, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent {

  readonly facade = inject(CategoryFacade);
  private readonly confirm = inject(ConfirmService);
  private readonly service = inject(CategoryGateway);
  private readonly dialogService = inject(DialogService);

  drop(event: CdkDragDrop<Category[]>) {
    console.log('========>', event);
    moveItemInArray(this.facade.categories(), event.previousIndex, event.currentIndex);
  }

  openCategoryDialog(): void {
    this.dialogService.open(CategoryComponent, {
      header: 'Ajouter une categorie',
      width: '50%',
      appendTo: 'body',
      closable: true
    });
  }

  openHobbiteDialog(): void {
    this.dialogService.open(AddHobbiteComponent, {
      header: 'Ajouter un loisir',
      width: '700px',
      appendTo: 'body',
      closable: true
    });
  }

  unsupported(): void {
    this.facade.getUnsupportedMethod(25);
  }

  onSearchWithPagination(){
    this.service.getAllWithPagination().subscribe(data => {
      console.log("Items: ", data);
    });

  }

  deleteCategory(category: Category): void {
    this.confirm.showConfirmDelete(
      `Êtes-vous sûr de vouloir supprimer la catégorie ${category.name} ?`,
      () => {
        this.facade.deleteCategory(category);
      },
      () => {
        console.log('Deletion cancelled');
      },
      'pi pi-exclamation-triangle',
      'Supprimer un produit',
    );
  }
}

