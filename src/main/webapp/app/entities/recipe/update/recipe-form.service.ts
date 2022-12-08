import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRecipe, NewRecipe } from '../recipe.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRecipe for edit and NewRecipeFormGroupInput for create.
 */
type RecipeFormGroupInput = IRecipe | PartialWithRequiredKeyOf<NewRecipe>;

type RecipeFormDefaults = Pick<NewRecipe, 'id' | 'publicAccess'>;

type RecipeFormGroupContent = {
  id: FormControl<IRecipe['id'] | NewRecipe['id']>;
  name: FormControl<IRecipe['name']>;
  instructions: FormControl<IRecipe['instructions']>;
  nbOfPerson: FormControl<IRecipe['nbOfPerson']>;
  publicAccess: FormControl<IRecipe['publicAccess']>;
  author: FormControl<IRecipe['author']>;
  schedule: FormControl<IRecipe['schedule']>;
};

export type RecipeFormGroup = FormGroup<RecipeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RecipeFormService {
  createRecipeFormGroup(recipe: RecipeFormGroupInput = { id: null }): RecipeFormGroup {
    const recipeRawValue = {
      ...this.getFormDefaults(),
      ...recipe,
    };
    return new FormGroup<RecipeFormGroupContent>({
      id: new FormControl(
        { value: recipeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(recipeRawValue.name, {
        validators: [Validators.required],
      }),
      instructions: new FormControl(recipeRawValue.instructions, {
        validators: [Validators.required],
      }),
      nbOfPerson: new FormControl(recipeRawValue.nbOfPerson, {
        validators: [Validators.required, Validators.min(0)],
      }),
      publicAccess: new FormControl(recipeRawValue.publicAccess, {
        validators: [Validators.required],
      }),
      author: new FormControl(recipeRawValue.author),
      schedule: new FormControl(recipeRawValue.schedule),
    });
  }

  getRecipe(form: RecipeFormGroup): IRecipe | NewRecipe {
    return form.getRawValue() as IRecipe | NewRecipe;
  }

  resetForm(form: RecipeFormGroup, recipe: RecipeFormGroupInput): void {
    const recipeRawValue = { ...this.getFormDefaults(), ...recipe };
    form.reset(
      {
        ...recipeRawValue,
        id: { value: recipeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RecipeFormDefaults {
    return {
      id: null,
      publicAccess: false,
    };
  }
}
