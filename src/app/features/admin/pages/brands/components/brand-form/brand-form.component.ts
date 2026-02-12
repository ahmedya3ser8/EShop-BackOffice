import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MainTitleComponent } from "@shared/components";
import { ToastrService } from 'ngx-toastr';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { BrandsService } from '../../services/brands.service';
import { Router } from '@angular/router';

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

  form!: FormGroup;
  maxFileSize: number = 1000000; // 1MB
  maxFileSizeInMB: string = (this.maxFileSize / 1_000_000).toFixed(1);
  imageRatio: string = '1/1';
  imageExample: string = '600px * 600px';
  imagePreview: string | null = null;
  loading: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      image: ['', [Validators.required]]
    })
  }

  submitForm(): void {
    if (this.form.valid) {
      this.loading = true;

      const formData = new FormData();
      formData.append('name', this.form.get('name')?.value);
      formData.append('image', this.form.get('image')?.value);

      this.brandsService.createNewBrand(formData).subscribe({
        next: (res) => {
          console.log(res);
          if (res.data) {
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
    } else {
      this.toastr.error('all fields are required');
      this.form.markAllAsTouched();
    }
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
