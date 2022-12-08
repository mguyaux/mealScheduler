import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMesure, NewMesure } from '../mesure.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMesure for edit and NewMesureFormGroupInput for create.
 */
type MesureFormGroupInput = IMesure | PartialWithRequiredKeyOf<NewMesure>;

type MesureFormDefaults = Pick<NewMesure, 'id'>;

type MesureFormGroupContent = {
  id: FormControl<IMesure['id'] | NewMesure['id']>;
  symbol: FormControl<IMesure['symbol']>;
};

export type MesureFormGroup = FormGroup<MesureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MesureFormService {
  createMesureFormGroup(mesure: MesureFormGroupInput = { id: null }): MesureFormGroup {
    const mesureRawValue = {
      ...this.getFormDefaults(),
      ...mesure,
    };
    return new FormGroup<MesureFormGroupContent>({
      id: new FormControl(
        { value: mesureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      symbol: new FormControl(mesureRawValue.symbol, {
        validators: [Validators.required],
      }),
    });
  }

  getMesure(form: MesureFormGroup): IMesure | NewMesure {
    return form.getRawValue() as IMesure | NewMesure;
  }

  resetForm(form: MesureFormGroup, mesure: MesureFormGroupInput): void {
    const mesureRawValue = { ...this.getFormDefaults(), ...mesure };
    form.reset(
      {
        ...mesureRawValue,
        id: { value: mesureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MesureFormDefaults {
    return {
      id: null,
    };
  }
}
