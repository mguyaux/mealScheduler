import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRecipeIngredient, NewRecipeIngredient } from '../recipe-ingredient.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRecipeIngredient for edit and NewRecipeIngredientFormGroupInput for create.
 */
type RecipeIngredientFormGroupInput = IRecipeIngredient | PartialWithRequiredKeyOf<NewRecipeIngredient>;

type RecipeIngredientFormDefaults = Pick<NewRecipeIngredient, 'id'>;

type RecipeIngredientFormGroupContent = {
  id: FormControl<IRecipeIngredient['id'] | NewRecipeIngredient['id']>;
  quantity: FormControl<IRecipeIngredient['quantity']>;
  recipe: FormControl<IRecipeIngredient['recipe']>;
  unit: FormControl<IRecipeIngredient['unit']>;
  ingredient: FormControl<IRecipeIngredient['ingredient']>;
};

export type RecipeIngredientFormGroup = FormGroup<RecipeIngredientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RecipeIngredientFormService {
  createRecipeIngredientFormGroup(recipeIngredient: RecipeIngredientFormGroupInput = { id: null }): RecipeIngredientFormGroup {
    const recipeIngredientRawValue = {
      ...this.getFormDefaults(),
      ...recipeIngredient,
    };
    return new FormGroup<RecipeIngredientFormGroupContent>({
      id: new FormControl(
        { value: recipeIngredientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      quantity: new FormControl(recipeIngredientRawValue.quantity, {
        validators: [Validators.required],
      }),
      recipe: new FormControl(recipeIngredientRawValue.recipe),
      unit: new FormControl(recipeIngredientRawValue.unit),
      ingredient: new FormControl(recipeIngredientRawValue.ingredient),
    });
  }

  getRecipeIngredient(form: RecipeIngredientFormGroup): IRecipeIngredient | NewRecipeIngredient {
    return form.getRawValue() as IRecipeIngredient | NewRecipeIngredient;
  }

  resetForm(form: RecipeIngredientFormGroup, recipeIngredient: RecipeIngredientFormGroupInput): void {
    const recipeIngredientRawValue = { ...this.getFormDefaults(), ...recipeIngredient };
    form.reset(
      {
        ...recipeIngredientRawValue,
        id: { value: recipeIngredientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RecipeIngredientFormDefaults {
    return {
      id: null,
    };
  }
}
