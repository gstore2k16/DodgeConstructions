import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ItemStateService } from '../../services/item-state.service';
import { ItemDetailViewComponent } from '../../components/item-detail-view/item-detail-view.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
    selector: 'app-item-detail',
    standalone: true,
    imports: [CommonModule, ItemDetailViewComponent, LoadingComponent, ErrorComponent],
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly stateService = inject(ItemStateService);
    private readonly destroyRef = inject(DestroyRef);

    // Readonly signals exposed to template
    public readonly item = this.stateService.selectedItem;
    public readonly loading = this.stateService.loading;
    public readonly error = this.stateService.error;

    ngOnInit(): void {
        this.route.paramMap.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((params: ParamMap) => {
            const idParam: string | null = params.get('id');
            if (idParam) {
                const id: number = Number(idParam);
                this.stateService.selectItemById(id);
            } else {
                this.stateService.selectItemById(null);
            }
        });
    }
}
