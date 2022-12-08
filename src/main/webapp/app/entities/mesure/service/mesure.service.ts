import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMesure, NewMesure } from '../mesure.model';

export type PartialUpdateMesure = Partial<IMesure> & Pick<IMesure, 'id'>;

export type EntityResponseType = HttpResponse<IMesure>;
export type EntityArrayResponseType = HttpResponse<IMesure[]>;

@Injectable({ providedIn: 'root' })
export class MesureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mesures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mesure: NewMesure): Observable<EntityResponseType> {
    return this.http.post<IMesure>(this.resourceUrl, mesure, { observe: 'response' });
  }

  update(mesure: IMesure): Observable<EntityResponseType> {
    return this.http.put<IMesure>(`${this.resourceUrl}/${this.getMesureIdentifier(mesure)}`, mesure, { observe: 'response' });
  }

  partialUpdate(mesure: PartialUpdateMesure): Observable<EntityResponseType> {
    return this.http.patch<IMesure>(`${this.resourceUrl}/${this.getMesureIdentifier(mesure)}`, mesure, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMesure>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMesure[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMesureIdentifier(mesure: Pick<IMesure, 'id'>): number {
    return mesure.id;
  }

  compareMesure(o1: Pick<IMesure, 'id'> | null, o2: Pick<IMesure, 'id'> | null): boolean {
    return o1 && o2 ? this.getMesureIdentifier(o1) === this.getMesureIdentifier(o2) : o1 === o2;
  }

  addMesureToCollectionIfMissing<Type extends Pick<IMesure, 'id'>>(
    mesureCollection: Type[],
    ...mesuresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mesures: Type[] = mesuresToCheck.filter(isPresent);
    if (mesures.length > 0) {
      const mesureCollectionIdentifiers = mesureCollection.map(mesureItem => this.getMesureIdentifier(mesureItem)!);
      const mesuresToAdd = mesures.filter(mesureItem => {
        const mesureIdentifier = this.getMesureIdentifier(mesureItem);
        if (mesureCollectionIdentifiers.includes(mesureIdentifier)) {
          return false;
        }
        mesureCollectionIdentifiers.push(mesureIdentifier);
        return true;
      });
      return [...mesuresToAdd, ...mesureCollection];
    }
    return mesureCollection;
  }
}
