import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecipeIngredient } from '../recipe-ingredient.model';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './recipe-ingredient-delete-dialog.component.html',
})
export class RecipeIngredientDeleteDialogComponent {
  recipeIngredient?: IRecipeIngredient;

  constructor(protected recipeIngredientService: RecipeIngredientService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.recipeIngredientService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
