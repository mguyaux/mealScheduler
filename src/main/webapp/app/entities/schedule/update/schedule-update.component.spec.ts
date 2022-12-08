import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScheduleFormService } from './schedule-form.service';
import { ScheduleService } from '../service/schedule.service';
import { ISchedule } from '../schedule.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ScheduleUpdateComponent } from './schedule-update.component';

describe('Schedule Management Update Component', () => {
  let comp: ScheduleUpdateComponent;
  let fixture: ComponentFixture<ScheduleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scheduleFormService: ScheduleFormService;
  let scheduleService: ScheduleService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ScheduleUpdateComponent],
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
      .overrideTemplate(ScheduleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScheduleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scheduleFormService = TestBed.inject(ScheduleFormService);
    scheduleService = TestBed.inject(ScheduleService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const schedule: ISchedule = { id: 456 };
      const user: IUser = { id: 1547 };
      schedule.user = user;

      const userCollection: IUser[] = [{ id: 81409 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ schedule });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const schedule: ISchedule = { id: 456 };
      const user: IUser = { id: 3453 };
      schedule.user = user;

      activatedRoute.data = of({ schedule });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.schedule).toEqual(schedule);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedule>>();
      const schedule = { id: 123 };
      jest.spyOn(scheduleFormService, 'getSchedule').mockReturnValue(schedule);
      jest.spyOn(scheduleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: schedule }));
      saveSubject.complete();

      // THEN
      expect(scheduleFormService.getSchedule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(scheduleService.update).toHaveBeenCalledWith(expect.objectContaining(schedule));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedule>>();
      const schedule = { id: 123 };
      jest.spyOn(scheduleFormService, 'getSchedule').mockReturnValue({ id: null });
      jest.spyOn(scheduleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedule: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: schedule }));
      saveSubject.complete();

      // THEN
      expect(scheduleFormService.getSchedule).toHaveBeenCalled();
      expect(scheduleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISchedule>>();
      const schedule = { id: 123 };
      jest.spyOn(scheduleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ schedule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scheduleService.update).toHaveBeenCalled();
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
  });
});
