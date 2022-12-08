import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RecipeIngredientFormService } from './recipe-ingredient-form.service';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';
import { IRecipeIngredient } from '../recipe-ingredient.model';
import { IRecipe } from 'app/entities/recipe/recipe.model';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';
import { IMesure } from 'app/entities/mesure/mesure.model';
import { MesureService } from 'app/entities/mesure/service/mesure.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';

import { RecipeIngredientUpdateComponent } from './recipe-ingredient-update.component';

describe('RecipeIngredient Management Update Component', () => {
  let comp: RecipeIngredientUpdateComponent;
  let fixture: ComponentFixture<RecipeIngredientUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let recipeIngredientFormService: RecipeIngredientFormService;
  let recipeIngredientService: RecipeIngredientService;
  let recipeService: RecipeService;
  let mesureService: MesureService;
  let ingredientService: IngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RecipeIngredientUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RecipeIngredientUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RecipeIngredientUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    recipeIngredientFormService = TestBed.inject(RecipeIngredientFormService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);
    recipeService = TestBed.inject(RecipeService);
    mesureService = TestBed.inject(MesureService);
    ingredientService = TestBed.inject(IngredientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Recipe query and add missing value', () => {
      const recipeIngredient: IRecipeIngredient = { id: 456 };
      const recipe: IRecipe = { id: 48073 };
      recipeIngredient.recipe = recipe;

      const recipeCollection: IRecipe[] = [{ id: 79307 }];
      jest.spyOn(recipeService, 'query').mockReturnValue(of(new HttpResponse({ body: recipeCollection })));
      const additionalRecipes = [recipe];
      const expectedCollection: IRecipe[] = [...additionalRecipes, ...recipeCollection];
      jest.spyOn(recipeService, 'addRecipeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ recipeIngredient });
      comp.ngOnInit();

      expect(recipeService.query).toHaveBeenCalled();
      expect(recipeService.addRecipeToCollectionIfMissing).toHaveBeenCalledWith(
        recipeCollection,
        ...additionalRecipes.map(expect.objectContaining)
      );
      expect(comp.recipesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Mesure query and add missing value', () => {
      const recipeIngredient: IRecipeIngredient = { id: 456 };
      const unit: IMesure = { id: 33412 };
      recipeIngredient.unit = unit;

      const mesureCollection: IMesure[] = [{ id: 38302 }];
      jest.spyOn(mesureService, 'query').mockReturnValue(of(new HttpResponse({ body: mesureCollection })));
      const additionalMesures = [unit];
      const expectedCollection: IMesure[] = [...additionalMesures, ...mesureCollection];
      jest.spyOn(mesureService, 'addMesureToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ recipeIngredient });
      comp.ngOnInit();

      expect(mesureService.query).toHaveBeenCalled();
      expect(mesureService.addMesureToCollectionIfMissing).toHaveBeenCalledWith(
        mesureCollection,
        ...additionalMesures.map(expect.objectContaining)
      );
      expect(comp.mesuresSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ingredient query and add missing value', () => {
      const recipeIngredient: IRecipeIngredient = { id: 456 };
      const ingredient: IIngredient = { id: 15556 };
      recipeIngredient.ingredient = ingredient;

      const ingredientCollection: IIngredient[] = [{ id: 81359 }];
      jest.spyOn(ingredientService, 'query').mockReturnValue(of(new HttpResponse({ body: ingredientCollection })));
      const additionalIngredients = [ingredient];
      const expectedCollection: IIngredient[] = [...additionalIngredients, ...ingredientCollection];
      jest.spyOn(ingredientService, 'addIngredientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ recipeIngredient });
      comp.ngOnInit();

      expect(ingredientService.query).toHaveBeenCalled();
      expect(ingredientService.addIngredientToCollectionIfMissing).toHaveBeenCalledWith(
        ingredientCollection,
        ...additionalIngredients.map(expect.objectContaining)
      );
      expect(comp.ingredientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const recipeIngredient: IRecipeIngredient = { id: 456 };
      const recipe: IRecipe = { id: 79663 };
      recipeIngredient.recipe = recipe;
      const unit: IMesure = { id: 74685 };
      recipeIngredient.unit = unit;
      const ingredient: IIngredient = { id: 65397 };
      recipeIngredient.ingredient = ingredient;

      activatedRoute.data = of({ recipeIngredient });
      comp.ngOnInit();

      expect(comp.recipesSharedCollection).toContain(recipe);
      expect(comp.mesuresSharedCollection).toContain(unit);
      expect(comp.ingredientsSharedCollection).toContain(ingredient);
      expect(comp.recipeIngredient).toEqual(recipeIngredient);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecipeIngredient>>();
      const recipeIngredient = { id: 123 };
      jest.spyOn(recipeIngredientFormService, 'getRecipeIngredient').mockReturnValue(recipeIngredient);
      jest.spyOn(recipeIngredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipeIngredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recipeIngredient }));
      saveSubject.complete();

      // THEN
      expect(recipeIngredientFormService.getRecipeIngredient).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(recipeIngredientService.update).toHaveBeenCalledWith(expect.objectContaining(recipeIngredient));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecipeIngredient>>();
      const recipeIngredient = { id: 123 };
      jest.spyOn(recipeIngredientFormService, 'getRecipeIngredient').mockReturnValue({ id: null });
      jest.spyOn(recipeIngredientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipeIngredient: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recipeIngredient }));
      saveSubject.complete();

      // THEN
      expect(recipeIngredientFormService.getRecipeIngredient).toHaveBeenCalled();
      expect(recipeIngredientService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecipeIngredient>>();
      const recipeIngredient = { id: 123 };
      jest.spyOn(recipeIngredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipeIngredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(recipeIngredientService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRecipe', () => {
      it('Should forward to recipeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(recipeService, 'compareRecipe');
        comp.compareRecipe(entity, entity2);
        expect(recipeService.compareRecipe).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMesure', () => {
      it('Should forward to mesureService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(mesureService, 'compareMesure');
        comp.compareMesure(entity, entity2);
        expect(mesureService.compareMesure).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareIngredient', () => {
      it('Should forward to ingredientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ingredientService, 'compareIngredient');
        comp.compareIngredient(entity, entity2);
        expect(ingredientService.compareIngredient).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
