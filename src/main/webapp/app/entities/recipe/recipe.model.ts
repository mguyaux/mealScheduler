import { IUser } from 'app/entities/user/user.model';
import { ISchedule } from 'app/entities/schedule/schedule.model';

export interface IRecipe {
  id: number;
  name?: string | null;
  instructions?: string | null;
  nbOfPerson?: number | null;
  publicAccess?: boolean | null;
  author?: Pick<IUser, 'id'> | null;
  schedule?: Pick<ISchedule, 'id'> | null;
}

export type NewRecipe = Omit<IRecipe, 'id'> & { id: null };
