import { DeepPartial } from 'ts-essentials';
import create from 'zustand';
import { Certificering } from '../generated/graphql';

export interface IStore {
  personId?: number;
  //setPersonId: (personId: number) => void;
  licenses: DeepPartial<Certificering>[];
  //setLicenses: (licenses: DeepPartial<Certificering>[]) => void;
  licensesLoading: boolean;
  //setLicensesLoading: (loading: boolean) => void;
}

export const useStore = create<IStore & { setStore: (data: Partial<IStore>) => void }>((set) => ({
  //setPersonId: (personId) => set(() => ({ personId: personId })),
  licenses: [],
  licensesLoading: false,
  // setLicenses: (licenses) => set(() => ({ licenses: [...licenses] })),
  // setLicensesLoading: (loading) => set(() => ({ licensesLoading: loading })),
  setStore: (data) => set(() => ({ ...data } as IStore)),
}));
