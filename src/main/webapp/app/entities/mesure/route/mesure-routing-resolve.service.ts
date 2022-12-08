import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMesure } from '../mesure.model';
import { MesureService } from '../service/mesure.service';

@Injectable({ providedIn: 'root' })
export class MesureRoutingResolveService implements Resolve<IMesure | null> {
  constructor(protected service: MesureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMesure | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mesure: HttpResponse<IMesure>) => {
          if (mesure.body) {
            return of(mesure.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
