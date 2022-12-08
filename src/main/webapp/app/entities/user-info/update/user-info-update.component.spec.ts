import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserInfoFormService } from './user-info-form.service';
import { UserInfoService } from '../service/user-info.service';
import { IUserInfo } from '../user-info.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserInfoUpdateComponent } from './user-info-update.component';

describe('UserInfo Management Update Component', () => {
  let comp: UserInfoUpdateComponent;
  let fixture: ComponentFixture<UserInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userInfoFormService: UserInfoFormService;
  let userInfoService: UserInfoService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserInfoUpdateComponent],
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
      .overrideTemplate(UserInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userInfoFormService = TestBed.inject(UserInfoFormService);
    userInfoService = TestBed.inject(UserInfoService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userInfo: IUserInfo = { id: 456 };
      const user: IUser = { id: 8960 };
      userInfo.user = user;

      const userCollection: IUser[] = [{ id: 6673 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userInfo: IUserInfo = { id: 456 };
      const user: IUser = { id: 89045 };
      userInfo.user = user;

      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.userInfo).toEqual(userInfo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserInfo>>();
      const userInfo = { id: 123 };
      jest.spyOn(userInfoFormService, 'getUserInfo').mockReturnValue(userInfo);
      jest.spyOn(userInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userInfo }));
      saveSubject.complete();

      // THEN
      expect(userInfoFormService.getUserInfo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userInfoService.update).toHaveBeenCalledWith(expect.objectContaining(userInfo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserInfo>>();
      const userInfo = { id: 123 };
      jest.spyOn(userInfoFormService, 'getUserInfo').mockReturnValue({ id: null });
      jest.spyOn(userInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userInfo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userInfo }));
      saveSubject.complete();

      // THEN
      expect(userInfoFormService.getUserInfo).toHaveBeenCalled();
      expect(userInfoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserInfo>>();
      const userInfo = { id: 123 };
      jest.spyOn(userInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userInfoService.update).toHaveBeenCalled();
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
