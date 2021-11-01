import { DeepPartial } from 'ts-essentials';
import create from 'zustand';
import { Certificering, Persoon } from '../generated/graphql';

export interface IStore {
  personId?: number;
  person?: DeepPartial<Persoon>;
  licenses: DeepPartial<Certificering>[];
  licensesLoading: boolean;
  refreshTrigger: boolean;
  refresh: () => void;
}

export const useStore = create<IStore & { setStore: (data: Partial<IStore>) => void }>((set) => ({
  licenses: [],
  licensesLoading: false,
  setStore: (data) => set(() => ({ ...data } as IStore)),
  refreshTrigger: false,
  refresh: () => set(() => ({ refreshTrigger: true })),
}));
