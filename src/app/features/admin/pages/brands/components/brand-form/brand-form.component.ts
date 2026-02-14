import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';

import { MainTitleComponent } from "@shared/components";
import { BrandsService } from '../../services/brands.service';

@Component({
  selector: 'app-brand-form',
  imports: [MainTitleComponent, ReactiveFormsModule, FileUploadModule, TableModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly brandsService = inject(BrandsService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  form!: FormGroup;
  maxFileSize: number = 1000000; // 1MB
  maxFileSizeInMB: string = (this.maxFileSize / 1_000_000).toFixed(1);
  imageRatio: string = '1/1';
  imageExample: string = '600px * 600px';
  imagePreview: string | null = null;
  loading: boolean = false;
  isEditMode: boolean = false;
  brandId!: string;

  ngOnInit(): void {
    this.initForm();
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        if (param.get('id')) {
          this.brandId = param.get('id')!;
          this.isEditMode = true;
          this.getBrand(this.brandId);
        }
      }
    })
  }

  getBrand(id: string): void {
    this.brandsService.getBrand(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success')
        this.fillFormData(res.data);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch brand');
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
      // formData.append('image', this.form.get('image')?.value);

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
    console.log('fillFormData', formData);
    this.form.patchValue({
      name: formData.name,
      image: null
    })
    this.imagePreview = formData.image;
  }

  onCreate(formData: any): void {
    this.brandsService.createNewBrand(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('Brand created successfully');
          this.form.reset();
          this.imagePreview = null;
          this.router.navigate(['/brands']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to create brand');
        this.loading = false;
      }
    })
  }

  onEdit(formData: any): void {
    this.brandsService.updateBrand(this.brandId, formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('Brand updated successfully');
          this.form.reset();
          this.imagePreview = null;
          this.router.navigate(['/brands']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to create brand');
        this.loading = false;
      }
    })
  }

  onFileSelected(event: any): void {
    const file = event.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastr.error('Accept only image');
      return;
    }

    if (file.size > this.maxFileSize) {
      this.maxFileSizeInMB = (this.maxFileSize / 1_000_000).toFixed(1);
      this.toastr.error(`File size should be less than ${this.maxFileSizeInMB}MB`);
      return;
    }

    this.form.get('image')?.setValue(file);

    // create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeUploadedImage(): void {
    this.imagePreview = null;
    this.form.get('image')?.setValue(null);
  }
}
