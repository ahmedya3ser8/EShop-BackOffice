import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SubcategoryService } from '../../services/subcategory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MainTitleComponent } from "@shared/components";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { CategoriesService } from '@features/admin/pages/categories/services/categories.service';

@Component({
  selector: 'app-sub-category-form',
  imports: [ReactiveFormsModule, MainTitleComponent, SelectModule],
  templateUrl: './sub-category-form.component.html',
  styleUrl: './sub-category-form.component.scss'
})
export class SubCategoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly subcategoryService = inject(SubcategoryService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  form!: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  subCategoryId!: string;
  categoryIdsList: { _id: string; name: string; }[] = [];
  currentPage = 1;
  rows = 10;

  ngOnInit(): void {
    this.initForm();
    this.getId();
    this.getAllCategories();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        if (param.get('id')) {
          this.subCategoryId = param.get('id')!;
          this.isEditMode = true;
          this.getSubCategory(this.subCategoryId);
        }
      }
    })
  }

  getSubCategory(id: string): void {
    this.subcategoryService.getSubCategory(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success')
        this.fillFormData(res.data);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch subCategory');
      }
    })
  }

  getAllCategories(): void {
    this.loading = true;
    const paginateObj = {
      currentPage: this.currentPage,
      limit: this.rows,
      sort: '',
      keyword: '',
      fields: ''
    }
    this.categoriesService.getAllCategories(paginateObj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.categoryIdsList = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch all categories');
        this.loading = false;
      }
    })
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      category: ['', [Validators.required]]
    })
  }

  submitForm(): void {
    if (this.form.valid) {
      this.loading = true;

      if (this.isEditMode) {
        this.onEdit(this.form.value);
      } else {
        this.onCreate(this.form.value);
      }

    } else {
      this.toastr.error('all fields are required');
      this.form.markAllAsTouched();
    }
  }

  fillFormData(formData: any): void {
    this.form.patchValue({
      name: formData.name,
      category: formData.category._id
    })
  }

  onCreate(formData: any): void {
    this.subcategoryService.createNewSubCategory(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('SubCategory created successfully');
          this.form.reset();
          this.router.navigate(['/subcategories']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to create subCategory');
        this.loading = false;
      }
    })
  }

  onEdit(formData: any): void {
    this.subcategoryService.updateSubCategory(this.subCategoryId, formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('SubCategory updated successfully');
          this.form.reset();
          this.router.navigate(['/subcategories']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to create subCategory');
        this.loading = false;
      }
    })
  }
}
