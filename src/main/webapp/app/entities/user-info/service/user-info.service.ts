import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserInfo, NewUserInfo } from '../user-info.model';

export type PartialUpdateUserInfo = Partial<IUserInfo> & Pick<IUserInfo, 'id'>;

export type EntityResponseType = HttpResponse<IUserInfo>;
export type EntityArrayResponseType = HttpResponse<IUserInfo[]>;

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userInfo: NewUserInfo): Observable<EntityResponseType> {
    return this.http.post<IUserInfo>(this.resourceUrl, userInfo, { observe: 'response' });
  }

  update(userInfo: IUserInfo): Observable<EntityResponseType> {
    return this.http.put<IUserInfo>(`${this.resourceUrl}/${this.getUserInfoIdentifier(userInfo)}`, userInfo, { observe: 'response' });
  }

  partialUpdate(userInfo: PartialUpdateUserInfo): Observable<EntityResponseType> {
    return this.http.patch<IUserInfo>(`${this.resourceUrl}/${this.getUserInfoIdentifier(userInfo)}`, userInfo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserInfoIdentifier(userInfo: Pick<IUserInfo, 'id'>): number {
    return userInfo.id;
  }

  compareUserInfo(o1: Pick<IUserInfo, 'id'> | null, o2: Pick<IUserInfo, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserInfoIdentifier(o1) === this.getUserInfoIdentifier(o2) : o1 === o2;
  }

  addUserInfoToCollectionIfMissing<Type extends Pick<IUserInfo, 'id'>>(
    userInfoCollection: Type[],
    ...userInfosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userInfos: Type[] = userInfosToCheck.filter(isPresent);
    if (userInfos.length > 0) {
      const userInfoCollectionIdentifiers = userInfoCollection.map(userInfoItem => this.getUserInfoIdentifier(userInfoItem)!);
      const userInfosToAdd = userInfos.filter(userInfoItem => {
        const userInfoIdentifier = this.getUserInfoIdentifier(userInfoItem);
        if (userInfoCollectionIdentifiers.includes(userInfoIdentifier)) {
          return false;
        }
        userInfoCollectionIdentifiers.push(userInfoIdentifier);
        return true;
      });
      return [...userInfosToAdd, ...userInfoCollection];
    }
    return userInfoCollection;
  }
}
