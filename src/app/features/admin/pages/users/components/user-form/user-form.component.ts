import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UsersService } from '../../services/users.service';
import { MainTitleComponent } from "@shared/components";

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, MainTitleComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  form!: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  userId!: string;

  ngOnInit(): void {
    this.initForm();
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        if (param.get('id')) {
          this.userId = param.get('id')!;
          this.isEditMode = true;
          this.prepareEditMode();
          this.getUser(this.userId);
        }
      }
    })
  }

  prepareEditMode(): void {
    this.form.removeControl('confirmPassword');
    this.form.clearValidators();
    this.form.updateValueAndValidity();
  }

  getUser(id: string): void {
    this.usersService.getUser(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
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
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['']
    }, { validators: this.confirmPassword })
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
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      role: formData.role
    })
  }

  onCreate(formData: any): void {
    this.usersService.createNewUser(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastr.success('User created successfully');
          this.form.reset();
          this.router.navigate(['/users']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to create user');
        this.loading = false;
      }
    })
  }

  onEdit(formData: any): void {
    this.usersService.updateUser(this.userId, formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data) {
          this.toastr.success('User updated successfully');
          this.form.reset();
          this.router.navigate(['/users']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to create user');
        this.loading = false;
      }
    })
  }

  confirmPassword(group: AbstractControl) {
    const field = group.get('password')?.value;
    const confirmField = group.get('confirmPassword')?.value;
    if (field === confirmField) {
      return null;
    } else {
      return { mismatch: true }
    }
  }
}
