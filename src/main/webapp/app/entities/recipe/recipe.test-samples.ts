import { IRecipe, NewRecipe } from './recipe.model';

export const sampleWithRequiredData: IRecipe = {
  id: 37149,
  name: 'Cambridgeshire Fresh IB',
  instructions: '../fake-data/blob/hipster.txt',
  nbOfPerson: 93302,
  publicAccess: true,
};

export const sampleWithPartialData: IRecipe = {
  id: 80379,
  name: 'Saint-Jacques Saint-Denis',
  instructions: '../fake-data/blob/hipster.txt',
  nbOfPerson: 85311,
  publicAccess: false,
};

export const sampleWithFullData: IRecipe = {
  id: 36348,
  name: 'Metal Algérie',
  instructions: '../fake-data/blob/hipster.txt',
  nbOfPerson: 26087,
  publicAccess: true,
};

export const sampleWithNewData: NewRecipe = {
  name: 'Berkshire Bike out-of-the-box',
  instructions: '../fake-data/blob/hipster.txt',
  nbOfPerson: 53708,
  publicAccess: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
