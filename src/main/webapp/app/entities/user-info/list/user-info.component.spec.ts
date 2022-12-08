import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserInfoService } from '../service/user-info.service';

import { UserInfoComponent } from './user-info.component';

describe('UserInfo Management Component', () => {
  let comp: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let service: UserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-info', component: UserInfoComponent }]), HttpClientTestingModule],
      declarations: [UserInfoComponent],
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
      .overrideTemplate(UserInfoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserInfoService);

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
    expect(comp.userInfos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userInfoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserInfoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserInfoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
