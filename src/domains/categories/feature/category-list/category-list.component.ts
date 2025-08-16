import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CategoryComponent } from '@domains/categories/ui/category.component';
import { CategoryFacade } from '@domains/categories/utils/category-fascade';
import { Category } from '@domains/shared/models/category.model';
import { ConfirmService } from '@domains/shared/services/confirm/confirm.service';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ButtonModule, AsyncPipe],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  providers: [CategoryFacade],
})
export class CategoryListComponent implements OnInit {

  readonly facade = inject(CategoryFacade);
  private readonly confirm = inject(ConfirmService);
  private readonly dialogService = inject(DialogService);

  ngOnInit(): void {
    this.facade.init();
  }

  openCategoryDialog(): void {
    this.dialogService.open(CategoryComponent, {
      header: 'Ajouter une categorie',
      width: '50%',
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
