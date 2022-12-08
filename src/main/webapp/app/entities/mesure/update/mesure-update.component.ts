import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MesureFormService, MesureFormGroup } from './mesure-form.service';
import { IMesure } from '../mesure.model';
import { MesureService } from '../service/mesure.service';

@Component({
  selector: 'msche-mesure-update',
  templateUrl: './mesure-update.component.html',
})
export class MesureUpdateComponent implements OnInit {
  isSaving = false;
  mesure: IMesure | null = null;

  editForm: MesureFormGroup = this.mesureFormService.createMesureFormGroup();

  constructor(
    protected mesureService: MesureService,
    protected mesureFormService: MesureFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mesure }) => {
      this.mesure = mesure;
      if (mesure) {
        this.updateForm(mesure);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mesure = this.mesureFormService.getMesure(this.editForm);
    if (mesure.id !== null) {
      this.subscribeToSaveResponse(this.mesureService.update(mesure));
    } else {
      this.subscribeToSaveResponse(this.mesureService.create(mesure));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMesure>>): void {
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

  protected updateForm(mesure: IMesure): void {
    this.mesure = mesure;
    this.mesureFormService.resetForm(this.editForm, mesure);
  }
}
