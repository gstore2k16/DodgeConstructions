import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Item, ProductItem } from '../models/item.model';
import { environment } from '../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ItemService {
    private readonly http = inject(HttpClient);
    private readonly url = environment.apiUrl;

    /**
     * Fetches all items from the JSON asset and maps each raw object
     * into a typed ProductItem instance.
     */
    public getItems(): Observable<Item[]> {
        return this.http
            .get<Record<string, unknown>[]>(this.url)
            .pipe(
                map((data: Record<string, unknown>[]) =>
                    data.map((raw: Record<string, unknown>) => ProductItem.fromJson(raw))
                )
            );
    }

    /**
     * Fetches a single item by its ID.
     * Retrieves the full list and filters to find the matching item.
     */
    public getItemById(id: number): Observable<Item | undefined> {
        return this.getItems().pipe(
            map((items: Item[]) => items.find((item: Item) => item.id === id))
        );
    }
}
