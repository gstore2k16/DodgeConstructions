import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Item } from '../models/item.model';
import { ProductItem } from '../models/product-item.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ItemService {
    private readonly http = inject(HttpClient);
    private readonly url = environment.apiUrl;
    private items$?: Observable<Item[]>;

    /**
     * Fetches all items from the API/Asset URL with shareReplay caching
     * to prevent redundant HTTP requests during navigation.
     */
    public getItems(): Observable<Item[]> {
        if (!this.items$) {
            this.items$ = this.http
                .get<Record<string, unknown>[]>(this.url)
                .pipe(
                    map((data: Record<string, unknown>[]) =>
                        data.map((raw: Record<string, unknown>) => ProductItem.fromJson(raw))
                    ),
                    shareReplay(1)
                );
        }
        return this.items$;
    }

    /**
     * Fetches a single item by its ID.
     */
    public getItemById(id: number): Observable<Item | undefined> {
        return this.getItems().pipe(
            map((items: Item[]) => items.find((item: Item) => item.id === id))
        );
    }

    /**
     * Invalidates in-memory item cache.
     */
    public clearCache(): void {
        this.items$ = undefined;
    }
}
