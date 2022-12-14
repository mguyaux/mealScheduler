import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ScheduleService } from '../service/schedule.service';

import { ScheduleComponent } from './schedule.component';

describe('Schedule Management Component', () => {
  let comp: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let service: ScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'schedule', component: ScheduleComponent }]), HttpClientTestingModule],
      declarations: [ScheduleComponent],
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
      .overrideTemplate(ScheduleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScheduleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ScheduleService);

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
    expect(comp.schedules?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to scheduleService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getScheduleIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getScheduleIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
