import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../services/brands.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainTitleComponent } from "@shared/components";
import { IBrandData } from '../../models/ibrand';

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
        console.log(param);
        this.brandId = param.get('id')!;
        this.getBrand(this.brandId);
      }
    })
  }

  getBrand(id: string): void {
    console.log(id);
    this.brandsService.getBrand(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data) {
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
