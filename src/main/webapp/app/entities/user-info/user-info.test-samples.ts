import { IUserInfo, NewUserInfo } from './user-info.model';

export const sampleWithRequiredData: IUserInfo = {
  id: 11363,
  nbOfPerson: 5230,
};

export const sampleWithPartialData: IUserInfo = {
  id: 60057,
  nbOfPerson: 18650,
};

export const sampleWithFullData: IUserInfo = {
  id: 28466,
  nbOfPerson: 46417,
};

export const sampleWithNewData: NewUserInfo = {
  nbOfPerson: 2989,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
