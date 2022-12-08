import dayjs from 'dayjs/esm';

import { Meal } from 'app/entities/enumerations/meal.model';

import { ISchedule, NewSchedule } from './schedule.model';

export const sampleWithRequiredData: ISchedule = {
  id: 76377,
  meal: Meal['DINNER'],
  date: dayjs('2022-12-08'),
};

export const sampleWithPartialData: ISchedule = {
  id: 20477,
  meal: Meal['DINNER'],
  date: dayjs('2022-12-07'),
};

export const sampleWithFullData: ISchedule = {
  id: 66246,
  meal: Meal['LUNCH'],
  date: dayjs('2022-12-08'),
};

export const sampleWithNewData: NewSchedule = {
  meal: Meal['BREAKFAST'],
  date: dayjs('2022-12-08'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
