import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRecipeIngredient } from '../recipe-ingredient.model';

@Component({
  selector: 'msche-recipe-ingredient-detail',
  templateUrl: './recipe-ingredient-detail.component.html',
})
export class RecipeIngredientDetailComponent implements OnInit {
  recipeIngredient: IRecipeIngredient | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipeIngredient }) => {
      this.recipeIngredient = recipeIngredient;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
