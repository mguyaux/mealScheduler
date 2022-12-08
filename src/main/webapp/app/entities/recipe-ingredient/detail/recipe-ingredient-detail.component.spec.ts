import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecipeIngredientDetailComponent } from './recipe-ingredient-detail.component';

describe('RecipeIngredient Management Detail Component', () => {
  let comp: RecipeIngredientDetailComponent;
  let fixture: ComponentFixture<RecipeIngredientDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeIngredientDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ recipeIngredient: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RecipeIngredientDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RecipeIngredientDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load recipeIngredient on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.recipeIngredient).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
