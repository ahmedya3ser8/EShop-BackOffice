import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MainTitleComponent } from "@shared/components";
import { CategoriesService } from '../../services/categories.service';
import { ICategoryData } from '../../models/icategory';

@Component({
  selector: 'app-category-details',
  imports: [MainTitleComponent, RouterLink],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  categoryId!: string;
  categoryData: ICategoryData = {} as ICategoryData;

  ngOnInit(): void {
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.categoryId = param.get('id')!;
        this.getCategory(this.categoryId);
      }
    })
  }

  getCategory(id: string): void {
    this.categoriesService.getCategory(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.categoryData = res.data;
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch category');
      }
    })
  }
}
