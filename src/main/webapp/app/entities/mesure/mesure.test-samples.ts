import { IMesure, NewMesure } from './mesure.model';

export const sampleWithRequiredData: IMesure = {
  id: 78013,
  symbol: 'Ergonomic deposit Dinar',
};

export const sampleWithPartialData: IMesure = {
  id: 60192,
  symbol: 'Architecte Saint-Bernard open-source',
};

export const sampleWithFullData: IMesure = {
  id: 98606,
  symbol: 'JSON ADP',
};

export const sampleWithNewData: NewMesure = {
  symbol: "d'Alésia encoding",
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
