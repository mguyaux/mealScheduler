import { IRecipe } from 'app/entities/recipe/recipe.model';
import { IMesure } from 'app/entities/mesure/mesure.model';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';

export interface IRecipeIngredient {
  id: number;
  quantity?: number | null;
  recipe?: Pick<IRecipe, 'id'> | null;
  unit?: Pick<IMesure, 'id'> | null;
  ingredient?: Pick<IIngredient, 'id'> | null;
}

export type NewRecipeIngredient = Omit<IRecipeIngredient, 'id'> & { id: null };
