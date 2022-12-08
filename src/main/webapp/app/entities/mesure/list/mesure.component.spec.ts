import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MesureService } from '../service/mesure.service';

import { MesureComponent } from './mesure.component';

describe('Mesure Management Component', () => {
  let comp: MesureComponent;
  let fixture: ComponentFixture<MesureComponent>;
  let service: MesureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mesure', component: MesureComponent }]), HttpClientTestingModule],
      declarations: [MesureComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MesureComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MesureComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MesureService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.mesures?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mesureService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMesureIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMesureIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
