import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ScheduleFormService, ScheduleFormGroup } from './schedule-form.service';
import { ISchedule } from '../schedule.model';
import { ScheduleService } from '../service/schedule.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Meal } from 'app/entities/enumerations/meal.model';

@Component({
  selector: 'msche-schedule-update',
  templateUrl: './schedule-update.component.html',
})
export class ScheduleUpdateComponent implements OnInit {
  isSaving = false;
  schedule: ISchedule | null = null;
  mealValues = Object.keys(Meal);

  usersSharedCollection: IUser[] = [];

  editForm: ScheduleFormGroup = this.scheduleFormService.createScheduleFormGroup();

  constructor(
    protected scheduleService: ScheduleService,
    protected scheduleFormService: ScheduleFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ schedule }) => {
      this.schedule = schedule;
      if (schedule) {
        this.updateForm(schedule);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const schedule = this.scheduleFormService.getSchedule(this.editForm);
    if (schedule.id !== null) {
      this.subscribeToSaveResponse(this.scheduleService.update(schedule));
    } else {
      this.subscribeToSaveResponse(this.scheduleService.create(schedule));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISchedule>>): void {
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

  protected updateForm(schedule: ISchedule): void {
    this.schedule = schedule;
    this.scheduleFormService.resetForm(this.editForm, schedule);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, schedule.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.schedule?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
