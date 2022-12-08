import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RecipeIngredientFormService, RecipeIngredientFormGroup } from './recipe-ingredient-form.service';
import { IRecipeIngredient } from '../recipe-ingredient.model';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';
import { IRecipe } from 'app/entities/recipe/recipe.model';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';
import { IMesure } from 'app/entities/mesure/mesure.model';
import { MesureService } from 'app/entities/mesure/service/mesure.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';

@Component({
  selector: 'msche-recipe-ingredient-update',
  templateUrl: './recipe-ingredient-update.component.html',
})
export class RecipeIngredientUpdateComponent implements OnInit {
  isSaving = false;
  recipeIngredient: IRecipeIngredient | null = null;

  recipesSharedCollection: IRecipe[] = [];
  mesuresSharedCollection: IMesure[] = [];
  ingredientsSharedCollection: IIngredient[] = [];

  editForm: RecipeIngredientFormGroup = this.recipeIngredientFormService.createRecipeIngredientFormGroup();

  constructor(
    protected recipeIngredientService: RecipeIngredientService,
    protected recipeIngredientFormService: RecipeIngredientFormService,
    protected recipeService: RecipeService,
    protected mesureService: MesureService,
    protected ingredientService: IngredientService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRecipe = (o1: IRecipe | null, o2: IRecipe | null): boolean => this.recipeService.compareRecipe(o1, o2);

  compareMesure = (o1: IMesure | null, o2: IMesure | null): boolean => this.mesureService.compareMesure(o1, o2);

  compareIngredient = (o1: IIngredient | null, o2: IIngredient | null): boolean => this.ingredientService.compareIngredient(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipeIngredient }) => {
      this.recipeIngredient = recipeIngredient;
      if (recipeIngredient) {
        this.updateForm(recipeIngredient);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recipeIngredient = this.recipeIngredientFormService.getRecipeIngredient(this.editForm);
    if (recipeIngredient.id !== null) {
      this.subscribeToSaveResponse(this.recipeIngredientService.update(recipeIngredient));
    } else {
      this.subscribeToSaveResponse(this.recipeIngredientService.create(recipeIngredient));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecipeIngredient>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(recipeIngredient: IRecipeIngredient): void {
    this.recipeIngredient = recipeIngredient;
    this.recipeIngredientFormService.resetForm(this.editForm, recipeIngredient);

    this.recipesSharedCollection = this.recipeService.addRecipeToCollectionIfMissing<IRecipe>(
      this.recipesSharedCollection,
      recipeIngredient.recipe
    );
    this.mesuresSharedCollection = this.mesureService.addMesureToCollectionIfMissing<IMesure>(
      this.mesuresSharedCollection,
      recipeIngredient.unit
    );
    this.ingredientsSharedCollection = this.ingredientService.addIngredientToCollectionIfMissing<IIngredient>(
      this.ingredientsSharedCollection,
      recipeIngredient.ingredient
    );
  }

  protected loadRelationshipsOptions(): void {
    this.recipeService
      .query()
      .pipe(map((res: HttpResponse<IRecipe[]>) => res.body ?? []))
      .pipe(map((recipes: IRecipe[]) => this.recipeService.addRecipeToCollectionIfMissing<IRecipe>(recipes, this.recipeIngredient?.recipe)))
      .subscribe((recipes: IRecipe[]) => (this.recipesSharedCollection = recipes));

    this.mesureService
      .query()
      .pipe(map((res: HttpResponse<IMesure[]>) => res.body ?? []))
      .pipe(map((mesures: IMesure[]) => this.mesureService.addMesureToCollectionIfMissing<IMesure>(mesures, this.recipeIngredient?.unit)))
      .subscribe((mesures: IMesure[]) => (this.mesuresSharedCollection = mesures));

    this.ingredientService
      .query()
      .pipe(map((res: HttpResponse<IIngredient[]>) => res.body ?? []))
      .pipe(
        map((ingredients: IIngredient[]) =>
          this.ingredientService.addIngredientToCollectionIfMissing<IIngredient>(ingredients, this.recipeIngredient?.ingredient)
        )
      )
      .subscribe((ingredients: IIngredient[]) => (this.ingredientsSharedCollection = ingredients));
  }
}
