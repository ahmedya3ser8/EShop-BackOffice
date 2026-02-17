import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ImageUploadComponent, MainTitleComponent } from "@shared/components";
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-category-form',
  imports: [ImageUploadComponent, ReactiveFormsModule, MainTitleComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  form!: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  categoryId!: string;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        if (param.get('id')) {
          this.categoryId = param.get('id')!;
          this.isEditMode = true;
          this.getCategory(this.categoryId);
        }
      }
    })
  }

  getCategory(id: string): void {
    this.categoriesService.getCategory(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success')
        this.fillFormData(res.data);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch category');
      }
    })
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      image: ['']
    })
  }

  submitForm(): void {
    if (this.form.valid) {
      this.loading = true;

      const formData = new FormData();
      formData.append('name', this.form.get('name')?.value);

      const imageValue = this.form.get('image')?.value;

      // Only append if user uploaded a new file
      if (imageValue instanceof File) {
        formData.append('image', imageValue);
      }

      if (this.isEditMode) {
        this.onEdit(formData);
      } else {
        this.onCreate(formData);
      }

    } else {
      this.toastr.error('all fields are required');
      this.form.markAllAsTouched();
    }
  }

  fillFormData(formData: any): void {
    this.form.patchValue({
      name: formData.name,
      image: null
    })
    this.imagePreview = formData.image;
  }

  onCreate(formData: any): void {
    this.categoriesService.createNewCategory(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('Category created successfully');
          this.form.reset();
          this.router.navigate(['/categories']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to create category');
        this.loading = false;
      }
    })
  }

  onEdit(formData: any): void {
    this.categoriesService.updateCategory(this.categoryId, formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('Category updated successfully');
          this.form.reset();
          this.router.navigate(['/categories']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to create category');
        this.loading = false;
      }
    })
  }
}
