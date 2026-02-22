import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ITableCol } from '@features/admin/models/itabel';
import { DataViewComponent, MainTitleComponent } from "@shared/components";
import { UsersService } from '../../services/users.service';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-user-list',
  imports: [DataViewComponent, MainTitleComponent, RouterLink, ConfirmDialogModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly usersService = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  users: any[] = [];
  columns: ITableCol[] = [
    { field: 'fullName', header: 'FullName', isSort: true },
    { field: 'email', header: 'Email', isSort: true },
    { field: 'phoneNumber', header: 'Phone Number' },
    { field: 'role', header: 'Role' },
    { field: 'active', header: 'Status', isStatus: true },
  ];
  loading: boolean = false;
  totalRecords = 0;
  currentPage = 1;
  rows = 5;
  sortField = '';
  fields: string = 'fullName,email,phoneNumber,role,active';

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.loading = true;
    const paginateObj = {
      currentPage: this.currentPage,
      limit: this.rows,
      sort: this.sortField,
      fields: this.fields
    }
    this.usersService.getAllUsers(paginateObj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.users = res.data;
          this.currentPage = res.paginationResult.currentPage;
          this.totalRecords = res.paginationResult.totalRecords;
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch all users');
        this.loading = false;
      }
    })
  }

  onPageChange(value: { first: number; rows: number }): void {
    this.rows = value.rows;
    this.currentPage = Math.floor(value.first / value.rows) + 1;
    this.getAllUsers();
  }

  onSort(event: any): void {
    this.sortField = event.sortOrder === 1 ? event.sortField : `-${event.sortField}`;
    this.getAllUsers();
  }

  onView(id: string): void {
    this.router.navigate(['/users/view', id])
  }

  onEdit(id: string): void {
    this.router.navigate(['/users/edit', id])
  }

  onDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Deletion',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'confirm',
      rejectLabel: 'cancel',
      accept: () => this.deleteUser(id)
    })
  }

  deleteUser(id: string): void {
    this.usersService.deleteUser(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('user deactivated successfully');
          this.getAllUsers();
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to delete user');
      }
    })
  }

  onStatus({ id, active }: { id: string; active: boolean }): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to change user status?',
      header: 'Confirm Deletion',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'confirm',
      rejectLabel: 'cancel',
      accept: () => this.changeUserStatus(id, active)
    })
  }

  changeUserStatus(id: string, active: boolean): void {
    this.usersService.changeUserStatus(id, active).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.data) {
          const message = active
            ? 'User has been activated successfully.'
            : 'User has been deactivated successfully.';
          this.toastr.success(message);
          this.getAllUsers();
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to delete user');
      }
    })
  }
}
