import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RecipeIngredientComponent } from './list/recipe-ingredient.component';
import { RecipeIngredientDetailComponent } from './detail/recipe-ingredient-detail.component';
import { RecipeIngredientUpdateComponent } from './update/recipe-ingredient-update.component';
import { RecipeIngredientDeleteDialogComponent } from './delete/recipe-ingredient-delete-dialog.component';
import { RecipeIngredientRoutingModule } from './route/recipe-ingredient-routing.module';

@NgModule({
  imports: [SharedModule, RecipeIngredientRoutingModule],
  declarations: [
    RecipeIngredientComponent,
    RecipeIngredientDetailComponent,
    RecipeIngredientUpdateComponent,
    RecipeIngredientDeleteDialogComponent,
  ],
})
export class RecipeIngredientModule {}
