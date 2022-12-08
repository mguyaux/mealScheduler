export interface IMesure {
  id: number;
  symbol?: string | null;
}

export type NewMesure = Omit<IMesure, 'id'> & { id: null };
