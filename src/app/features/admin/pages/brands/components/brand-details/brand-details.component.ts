import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MainTitleComponent } from "@shared/components";
import { IBrandData } from '../../models/ibrand';
import { BrandsService } from '../../services/brands.service';

@Component({
  selector: 'app-brand-details',
  imports: [MainTitleComponent, RouterLink],
  templateUrl: './brand-details.component.html',
  styleUrl: './brand-details.component.scss'
})
export class BrandDetailsComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly brandsService = inject(BrandsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  brandId!: string;
  brandData: IBrandData = {} as IBrandData;

  ngOnInit(): void {
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.brandId = param.get('id')!;
        this.getBrand(this.brandId);
      }
    })
  }

  getBrand(id: string): void {
    this.brandsService.getBrand(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.brandData = res.data;
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch brand');
      }
    })
  }
}
