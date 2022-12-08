import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IRecipeIngredient } from '../recipe-ingredient.model';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';

import { RecipeIngredientRoutingResolveService } from './recipe-ingredient-routing-resolve.service';

describe('RecipeIngredient routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: RecipeIngredientRoutingResolveService;
  let service: RecipeIngredientService;
  let resultRecipeIngredient: IRecipeIngredient | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(RecipeIngredientRoutingResolveService);
    service = TestBed.inject(RecipeIngredientService);
    resultRecipeIngredient = undefined;
  });

  describe('resolve', () => {
    it('should return IRecipeIngredient returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRecipeIngredient = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRecipeIngredient).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRecipeIngredient = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultRecipeIngredient).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IRecipeIngredient>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRecipeIngredient = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRecipeIngredient).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
