import { IUser } from 'app/entities/user/user.model';

export interface IUserInfo {
  id: number;
  nbOfPerson?: number | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewUserInfo = Omit<IUserInfo, 'id'> & { id: null };
