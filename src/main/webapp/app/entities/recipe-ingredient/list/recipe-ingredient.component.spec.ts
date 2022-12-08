import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RecipeIngredientService } from '../service/recipe-ingredient.service';

import { RecipeIngredientComponent } from './recipe-ingredient.component';

describe('RecipeIngredient Management Component', () => {
  let comp: RecipeIngredientComponent;
  let fixture: ComponentFixture<RecipeIngredientComponent>;
  let service: RecipeIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'recipe-ingredient', component: RecipeIngredientComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [RecipeIngredientComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(RecipeIngredientComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RecipeIngredientComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RecipeIngredientService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.recipeIngredients?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to recipeIngredientService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRecipeIngredientIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRecipeIngredientIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
