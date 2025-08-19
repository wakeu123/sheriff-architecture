import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoryComponent } from '@domains/categories/ui/category.component';
import { CategoryFacade } from '@domains/categories/utils/category-fascade';
import { Category } from '@domains/shared/models/category.model';
import { ConfirmService } from '@domains/shared/services/confirm/confirm.service';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  providers: [CategoryFacade],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent {

  readonly facade = inject(CategoryFacade);
  private readonly confirm = inject(ConfirmService);
  private readonly dialogService = inject(DialogService);

  openCategoryDialog(): void {
    this.dialogService.open(CategoryComponent, {
      header: 'Ajouter une categorie',
      width: '50%',
      appendTo: 'body',
      closable: true
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
