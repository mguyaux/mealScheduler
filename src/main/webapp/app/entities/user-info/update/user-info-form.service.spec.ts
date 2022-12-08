import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-info.test-samples';

import { UserInfoFormService } from './user-info-form.service';

describe('UserInfo Form Service', () => {
  let service: UserInfoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoFormService);
  });

  describe('Service methods', () => {
    describe('createUserInfoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserInfoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nbOfPerson: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IUserInfo should create a new form with FormGroup', () => {
        const formGroup = service.createUserInfoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nbOfPerson: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getUserInfo', () => {
      it('should return NewUserInfo for default UserInfo initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserInfoFormGroup(sampleWithNewData);

        const userInfo = service.getUserInfo(formGroup) as any;

        expect(userInfo).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserInfo for empty UserInfo initial value', () => {
        const formGroup = service.createUserInfoFormGroup();

        const userInfo = service.getUserInfo(formGroup) as any;

        expect(userInfo).toMatchObject({});
      });

      it('should return IUserInfo', () => {
        const formGroup = service.createUserInfoFormGroup(sampleWithRequiredData);

        const userInfo = service.getUserInfo(formGroup) as any;

        expect(userInfo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserInfo should not enable id FormControl', () => {
        const formGroup = service.createUserInfoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserInfo should disable id FormControl', () => {
        const formGroup = service.createUserInfoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
