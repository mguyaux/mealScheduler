import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../recipe-ingredient.test-samples';

import { RecipeIngredientFormService } from './recipe-ingredient-form.service';

describe('RecipeIngredient Form Service', () => {
  let service: RecipeIngredientFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeIngredientFormService);
  });

  describe('Service methods', () => {
    describe('createRecipeIngredientFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRecipeIngredientFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            recipe: expect.any(Object),
            unit: expect.any(Object),
            ingredient: expect.any(Object),
          })
        );
      });

      it('passing IRecipeIngredient should create a new form with FormGroup', () => {
        const formGroup = service.createRecipeIngredientFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            recipe: expect.any(Object),
            unit: expect.any(Object),
            ingredient: expect.any(Object),
          })
        );
      });
    });

    describe('getRecipeIngredient', () => {
      it('should return NewRecipeIngredient for default RecipeIngredient initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRecipeIngredientFormGroup(sampleWithNewData);

        const recipeIngredient = service.getRecipeIngredient(formGroup) as any;

        expect(recipeIngredient).toMatchObject(sampleWithNewData);
      });

      it('should return NewRecipeIngredient for empty RecipeIngredient initial value', () => {
        const formGroup = service.createRecipeIngredientFormGroup();

        const recipeIngredient = service.getRecipeIngredient(formGroup) as any;

        expect(recipeIngredient).toMatchObject({});
      });

      it('should return IRecipeIngredient', () => {
        const formGroup = service.createRecipeIngredientFormGroup(sampleWithRequiredData);

        const recipeIngredient = service.getRecipeIngredient(formGroup) as any;

        expect(recipeIngredient).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRecipeIngredient should not enable id FormControl', () => {
        const formGroup = service.createRecipeIngredientFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRecipeIngredient should disable id FormControl', () => {
        const formGroup = service.createRecipeIngredientFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
