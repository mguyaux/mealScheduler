import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RecipeFormService, RecipeFormGroup } from './recipe-form.service';
import { IRecipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISchedule } from 'app/entities/schedule/schedule.model';
import { ScheduleService } from 'app/entities/schedule/service/schedule.service';

@Component({
  selector: 'msche-recipe-update',
  templateUrl: './recipe-update.component.html',
})
export class RecipeUpdateComponent implements OnInit {
  isSaving = false;
  recipe: IRecipe | null = null;

  usersSharedCollection: IUser[] = [];
  schedulesSharedCollection: ISchedule[] = [];

  editForm: RecipeFormGroup = this.recipeFormService.createRecipeFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected recipeService: RecipeService,
    protected recipeFormService: RecipeFormService,
    protected userService: UserService,
    protected scheduleService: ScheduleService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSchedule = (o1: ISchedule | null, o2: ISchedule | null): boolean => this.scheduleService.compareSchedule(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipe }) => {
      this.recipe = recipe;
      if (recipe) {
        this.updateForm(recipe);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('mealScheduelerApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recipe = this.recipeFormService.getRecipe(this.editForm);
    if (recipe.id !== null) {
      this.subscribeToSaveResponse(this.recipeService.update(recipe));
    } else {
      this.subscribeToSaveResponse(this.recipeService.create(recipe));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecipe>>): void {
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

  protected updateForm(recipe: IRecipe): void {
    this.recipe = recipe;
    this.recipeFormService.resetForm(this.editForm, recipe);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, recipe.author);
    this.schedulesSharedCollection = this.scheduleService.addScheduleToCollectionIfMissing<ISchedule>(
      this.schedulesSharedCollection,
      recipe.schedule
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.recipe?.author)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.scheduleService
      .query()
      .pipe(map((res: HttpResponse<ISchedule[]>) => res.body ?? []))
      .pipe(
        map((schedules: ISchedule[]) => this.scheduleService.addScheduleToCollectionIfMissing<ISchedule>(schedules, this.recipe?.schedule))
      )
      .subscribe((schedules: ISchedule[]) => (this.schedulesSharedCollection = schedules));
  }
}
