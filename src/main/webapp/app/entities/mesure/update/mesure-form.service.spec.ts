import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mesure.test-samples';

import { MesureFormService } from './mesure-form.service';

describe('Mesure Form Service', () => {
  let service: MesureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesureFormService);
  });

  describe('Service methods', () => {
    describe('createMesureFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMesureFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            symbol: expect.any(Object),
          })
        );
      });

      it('passing IMesure should create a new form with FormGroup', () => {
        const formGroup = service.createMesureFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            symbol: expect.any(Object),
          })
        );
      });
    });

    describe('getMesure', () => {
      it('should return NewMesure for default Mesure initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMesureFormGroup(sampleWithNewData);

        const mesure = service.getMesure(formGroup) as any;

        expect(mesure).toMatchObject(sampleWithNewData);
      });

      it('should return NewMesure for empty Mesure initial value', () => {
        const formGroup = service.createMesureFormGroup();

        const mesure = service.getMesure(formGroup) as any;

        expect(mesure).toMatchObject({});
      });

      it('should return IMesure', () => {
        const formGroup = service.createMesureFormGroup(sampleWithRequiredData);

        const mesure = service.getMesure(formGroup) as any;

        expect(mesure).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMesure should not enable id FormControl', () => {
        const formGroup = service.createMesureFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMesure should disable id FormControl', () => {
        const formGroup = service.createMesureFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
