import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { Meal } from 'app/entities/enumerations/meal.model';

export interface ISchedule {
  id: number;
  meal?: Meal | null;
  date?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewSchedule = Omit<ISchedule, 'id'> & { id: null };
