import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RecipeFormService } from './recipe-form.service';
import { RecipeService } from '../service/recipe.service';
import { IRecipe } from '../recipe.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISchedule } from 'app/entities/schedule/schedule.model';
import { ScheduleService } from 'app/entities/schedule/service/schedule.service';

import { RecipeUpdateComponent } from './recipe-update.component';

describe('Recipe Management Update Component', () => {
  let comp: RecipeUpdateComponent;
  let fixture: ComponentFixture<RecipeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let recipeFormService: RecipeFormService;
  let recipeService: RecipeService;
  let userService: UserService;
  let scheduleService: ScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RecipeUpdateComponent],
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
      .overrideTemplate(RecipeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RecipeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    recipeFormService = TestBed.inject(RecipeFormService);
    recipeService = TestBed.inject(RecipeService);
    userService = TestBed.inject(UserService);
    scheduleService = TestBed.inject(ScheduleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const recipe: IRecipe = { id: 456 };
      const author: IUser = { id: 22097 };
      recipe.author = author;

      const userCollection: IUser[] = [{ id: 40794 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [author];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Schedule query and add missing value', () => {
      const recipe: IRecipe = { id: 456 };
      const schedule: ISchedule = { id: 62522 };
      recipe.schedule = schedule;

      const scheduleCollection: ISchedule[] = [{ id: 4420 }];
      jest.spyOn(scheduleService, 'query').mockReturnValue(of(new HttpResponse({ body: scheduleCollection })));
      const additionalSchedules = [schedule];
      const expectedCollection: ISchedule[] = [...additionalSchedules, ...scheduleCollection];
      jest.spyOn(scheduleService, 'addScheduleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      expect(scheduleService.query).toHaveBeenCalled();
      expect(scheduleService.addScheduleToCollectionIfMissing).toHaveBeenCalledWith(
        scheduleCollection,
        ...additionalSchedules.map(expect.objectContaining)
      );
      expect(comp.schedulesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const recipe: IRecipe = { id: 456 };
      const author: IUser = { id: 83719 };
      recipe.author = author;
      const schedule: ISchedule = { id: 1201 };
      recipe.schedule = schedule;

      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(author);
      expect(comp.schedulesSharedCollection).toContain(schedule);
      expect(comp.recipe).toEqual(recipe);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecipe>>();
      const recipe = { id: 123 };
      jest.spyOn(recipeFormService, 'getRecipe').mockReturnValue(recipe);
      jest.spyOn(recipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recipe }));
      saveSubject.complete();

      // THEN
      expect(recipeFormService.getRecipe).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalledWith(expect.objectContaining(recipe));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecipe>>();
      const recipe = { id: 123 };
      jest.spyOn(recipeFormService, 'getRecipe').mockReturnValue({ id: null });
      jest.spyOn(recipeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recipe }));
      saveSubject.complete();

      // THEN
      expect(recipeFormService.getRecipe).toHaveBeenCalled();
      expect(recipeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecipe>>();
      const recipe = { id: 123 };
      jest.spyOn(recipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(recipeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSchedule', () => {
      it('Should forward to scheduleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(scheduleService, 'compareSchedule');
        comp.compareSchedule(entity, entity2);
        expect(scheduleService.compareSchedule).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
