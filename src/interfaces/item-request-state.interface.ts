import { Item } from '../models/item.model';

export interface ItemRequestState {
  readonly items: readonly Item[];
  readonly loading: boolean;
  readonly error: string | null;
}
