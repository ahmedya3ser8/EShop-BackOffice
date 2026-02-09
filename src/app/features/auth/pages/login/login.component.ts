import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '@features/auth/services/auth.service';
import { Roles } from '@shared/enums/roles.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  form!: FormGroup;
  loading: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  submitForm(): void {
    if (this.loading) return;
    if (this.form.valid) {
      this.loading = true;
      this.authService.login(this.form.value).subscribe({
        next: (res) => {
          if (res.data.role === Roles.ADMIN) {
            this.toastr.success('Welcome back! Redirecting to dashboard...');
            this.router.navigate(['/dashboard']);
          } else {
            this.toastr.warning('Access denied. Admin privileges are required.');
          }
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log('Error', err);
          this.toastr.error(err.error.message || err.error.error || 'Something went wrong. Please try again.');
          this.loading = false;
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }
}
