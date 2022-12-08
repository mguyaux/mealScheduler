import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MesureFormService } from './mesure-form.service';
import { MesureService } from '../service/mesure.service';
import { IMesure } from '../mesure.model';

import { MesureUpdateComponent } from './mesure-update.component';

describe('Mesure Management Update Component', () => {
  let comp: MesureUpdateComponent;
  let fixture: ComponentFixture<MesureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mesureFormService: MesureFormService;
  let mesureService: MesureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MesureUpdateComponent],
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
      .overrideTemplate(MesureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MesureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mesureFormService = TestBed.inject(MesureFormService);
    mesureService = TestBed.inject(MesureService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mesure: IMesure = { id: 456 };

      activatedRoute.data = of({ mesure });
      comp.ngOnInit();

      expect(comp.mesure).toEqual(mesure);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMesure>>();
      const mesure = { id: 123 };
      jest.spyOn(mesureFormService, 'getMesure').mockReturnValue(mesure);
      jest.spyOn(mesureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mesure }));
      saveSubject.complete();

      // THEN
      expect(mesureFormService.getMesure).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mesureService.update).toHaveBeenCalledWith(expect.objectContaining(mesure));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMesure>>();
      const mesure = { id: 123 };
      jest.spyOn(mesureFormService, 'getMesure').mockReturnValue({ id: null });
      jest.spyOn(mesureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesure: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mesure }));
      saveSubject.complete();

      // THEN
      expect(mesureFormService.getMesure).toHaveBeenCalled();
      expect(mesureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMesure>>();
      const mesure = { id: 123 };
      jest.spyOn(mesureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mesureService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
