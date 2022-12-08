import { IRecipeIngredient, NewRecipeIngredient } from './recipe-ingredient.model';

export const sampleWithRequiredData: IRecipeIngredient = {
  id: 56345,
  quantity: 13595,
};

export const sampleWithPartialData: IRecipeIngredient = {
  id: 48264,
  quantity: 68298,
};

export const sampleWithFullData: IRecipeIngredient = {
  id: 75203,
  quantity: 80323,
};

export const sampleWithNewData: NewRecipeIngredient = {
  quantity: 75423,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
