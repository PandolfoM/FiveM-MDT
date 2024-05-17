export interface ProfileI {
  citizenid: string;
  name: string;
  pfp: string;
  dna: string;
  points: string;
  text: string;
  tags: string[];
  history: HistoryI[]
}

export interface Charge {
  title: string;
  time: string;
  fine: string;
  points: string;
  type: string;
  description: string;
  parole?: string;
}

export interface Charges {
  citizenid: number;
  warrant: boolean;
  processed: boolean;
  guilty: boolean;
  charges: Charge[];
}

export interface Warrant {
  citizenid: string;
  incidentid: number;
  name: string;
  pfp: string;
  end_date: number;
  title: string;
}

export interface References {
  incidentid?: number;
  reportid?: number;
  title: string;
}

export interface HistoryI {
  charges: Charge[];
  id: number;
}

export interface GetChargesData {
  charges: Charges[];
  history: HistoryI[];
}
