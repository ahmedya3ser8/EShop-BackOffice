import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { CategoriesService } from '../../services/categories.service';
import { ICategoryData } from '../../models/icategory';
import { ITableCol } from '@features/admin/models/itabel';
import { DataViewComponent, MainTitleComponent } from '@shared/components';

@Component({
  selector: 'app-category-list',
  imports: [MainTitleComponent, FormsModule, RouterLink, ConfirmDialogModule, DataViewComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  private searchSubject = new Subject<string>();
  categories: ICategoryData[] = [];
  columns: ITableCol[] = [
    { field: 'image', header: 'image', isImage: true },
    { field: 'name', header: 'Name', isSort: true }
  ];
  loading: boolean = false;
  totalRecords = 0;
  currentPage = 1;
  rows = 5;
  sortField = '';
  keyword = '';
  fields: string = 'name,image';

  ngOnInit(): void {
    this.getAllCategories();
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (value) => {
        this.keyword = value;
        this.currentPage = 1;
        this.getAllCategories();
      }
    })
  }

  getAllCategories(): void {
    this.loading = true;
    const paginateObj = {
      currentPage: this.currentPage,
      limit: this.rows,
      sort: this.sortField,
      keyword: this.keyword,
      fields: this.fields
    }
    this.categoriesService.getAllCategories(paginateObj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.categories = res.data;
          this.currentPage = res.paginationResult.currentPage;
          this.totalRecords = res.paginationResult.totalRecords;
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

  onPageChange(value: { first: number; rows: number }): void {
    this.rows = value.rows;
    this.currentPage = Math.floor(value.first / value.rows) + 1;
    this.getAllCategories();
  }

  onSearch(): void {
    this.searchSubject.next(this.keyword);
  }

  onSort(event: any): void {
    if (event.sortField === 'name') {
      this.sortField = event.sortOrder === 1 ? event.sortField : `-${event.sortField}`;
      this.getAllCategories();
    }
  }

  onView(id: string): void {
    this.router.navigate(['/categories/view', id])
  }

  onEdit(id: string): void {
    this.router.navigate(['/categories/edit', id])
  }

  onDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this category?',
      header: 'Confirm Deletion',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'confirm',
      rejectLabel: 'cancel',
      accept: () => this.deleteCategory(id)
    })
  }

  deleteCategory(id: string): void {
    this.categoriesService.deleteCategory(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('category deleted successfully');
          this.getAllCategories();
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to delete category');
      }
    })
  }
}
