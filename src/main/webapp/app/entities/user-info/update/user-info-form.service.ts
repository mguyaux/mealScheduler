import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserInfo, NewUserInfo } from '../user-info.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserInfo for edit and NewUserInfoFormGroupInput for create.
 */
type UserInfoFormGroupInput = IUserInfo | PartialWithRequiredKeyOf<NewUserInfo>;

type UserInfoFormDefaults = Pick<NewUserInfo, 'id'>;

type UserInfoFormGroupContent = {
  id: FormControl<IUserInfo['id'] | NewUserInfo['id']>;
  nbOfPerson: FormControl<IUserInfo['nbOfPerson']>;
  user: FormControl<IUserInfo['user']>;
};

export type UserInfoFormGroup = FormGroup<UserInfoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserInfoFormService {
  createUserInfoFormGroup(userInfo: UserInfoFormGroupInput = { id: null }): UserInfoFormGroup {
    const userInfoRawValue = {
      ...this.getFormDefaults(),
      ...userInfo,
    };
    return new FormGroup<UserInfoFormGroupContent>({
      id: new FormControl(
        { value: userInfoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nbOfPerson: new FormControl(userInfoRawValue.nbOfPerson, {
        validators: [Validators.required, Validators.min(1)],
      }),
      user: new FormControl(userInfoRawValue.user),
    });
  }

  getUserInfo(form: UserInfoFormGroup): IUserInfo | NewUserInfo {
    return form.getRawValue() as IUserInfo | NewUserInfo;
  }

  resetForm(form: UserInfoFormGroup, userInfo: UserInfoFormGroupInput): void {
    const userInfoRawValue = { ...this.getFormDefaults(), ...userInfo };
    form.reset(
      {
        ...userInfoRawValue,
        id: { value: userInfoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserInfoFormDefaults {
    return {
      id: null,
    };
  }
}
