import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubcategoryService } from '../../services/subcategory.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ISubCategoryData } from '../../models/isubcategory';
import { MainTitleComponent } from "@shared/components";

@Component({
  selector: 'app-sub-category-details',
  imports: [MainTitleComponent, RouterLink],
  templateUrl: './sub-category-details.component.html',
  styleUrl: './sub-category-details.component.scss'
})
export class SubCategoryDetailsComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly subcategoryService = inject(SubcategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  subCategoryId!: string;
  subCategoryData: ISubCategoryData = {} as ISubCategoryData;

  ngOnInit(): void {
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.subCategoryId = param.get('id')!;
        this.getSubCategory(this.subCategoryId);
      }
    })
  }

  getSubCategory(id: string): void {
    this.subcategoryService.getSubCategory(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.subCategoryData = res.data;
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch subCategory');
      }
    })
  }
}
