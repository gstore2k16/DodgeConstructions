import { Item } from '../models/item.model';

/** Snapshot of the item-loading HTTP request: the resolved items (once loaded), and its loading/error status. */
export interface ItemRequestState {
  readonly items: readonly Item[];
  readonly loading: boolean;
  readonly error: string | null;
}
