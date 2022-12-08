import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserInfoFormService, UserInfoFormGroup } from './user-info-form.service';
import { IUserInfo } from '../user-info.model';
import { UserInfoService } from '../service/user-info.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'msche-user-info-update',
  templateUrl: './user-info-update.component.html',
})
export class UserInfoUpdateComponent implements OnInit {
  isSaving = false;
  userInfo: IUserInfo | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: UserInfoFormGroup = this.userInfoFormService.createUserInfoFormGroup();

  constructor(
    protected userInfoService: UserInfoService,
    protected userInfoFormService: UserInfoFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userInfo }) => {
      this.userInfo = userInfo;
      if (userInfo) {
        this.updateForm(userInfo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userInfo = this.userInfoFormService.getUserInfo(this.editForm);
    if (userInfo.id !== null) {
      this.subscribeToSaveResponse(this.userInfoService.update(userInfo));
    } else {
      this.subscribeToSaveResponse(this.userInfoService.create(userInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserInfo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userInfo: IUserInfo): void {
    this.userInfo = userInfo;
    this.userInfoFormService.resetForm(this.editForm, userInfo);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userInfo.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userInfo?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
