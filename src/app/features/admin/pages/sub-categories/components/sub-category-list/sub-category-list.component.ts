import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { DataViewComponent, MainTitleComponent } from '@shared/components';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SubcategoryService } from '../../services/subcategory.service';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ITableCol } from '@features/admin/models/itabel';
import { ISubCategoryData } from '../../models/isubcategory';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sub-category-list',
  imports: [MainTitleComponent, FormsModule, RouterLink, ConfirmDialogModule, DataViewComponent],
  templateUrl: './sub-category-list.component.html',
  styleUrl: './sub-category-list.component.scss'
})
export class SubCategoryListComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly subcategoryService = inject(SubcategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  private searchSubject = new Subject<string>();
  subCategories: ISubCategoryData[] = [];
  columns: ITableCol[] = [
    { field: 'name', header: 'Name', isSort: true },
    { field: 'category.name', header: 'Category Name' }
  ];
  loading: boolean = false;
  totalRecords = 0;
  currentPage = 1;
  rows = 5;
  sortField = '';
  keyword = '';
  fields: string = 'name,category';

  ngOnInit(): void {
    this.getAllSubCategories();
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (value) => {
        this.keyword = value;
        this.currentPage = 1;
        this.getAllSubCategories();
      }
    })
  }

  getAllSubCategories(): void {
    this.loading = true;
    const paginateObj = {
      currentPage: this.currentPage,
      limit: this.rows,
      sort: this.sortField,
      keyword: this.keyword,
      fields: this.fields
    }
    this.subcategoryService.getAllSubCategories(paginateObj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.subCategories = res.data;
          this.currentPage = res.paginationResult.currentPage;
          this.totalRecords = res.paginationResult.totalRecords;
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch all subCategories');
        this.loading = false;
      }
    })
  }

  onPageChange(value: { first: number; rows: number }): void {
    this.rows = value.rows;
    this.currentPage = Math.floor(value.first / value.rows) + 1;
    this.getAllSubCategories();
  }

  onSearch(): void {
    this.searchSubject.next(this.keyword);
  }

  onSort(event: any): void {
    if (event.sortField === 'name') {
      this.sortField = event.sortOrder === 1 ? event.sortField : `-${event.sortField}`;
      this.getAllSubCategories();
    }
  }

  onView(id: string): void {
    this.router.navigate(['/subcategories/view', id])
  }

  onEdit(id: string): void {
    this.router.navigate(['/subcategories/edit', id])
  }

  onDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this subCategory?',
      header: 'Confirm Deletion',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'confirm',
      rejectLabel: 'cancel',
      accept: () => this.deleteSubCategory(id)
    })
  }

  deleteSubCategory(id: string): void {
    this.subcategoryService.deleteSubCategory(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('subCategory deleted successfully');
          this.getAllSubCategories();
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to delete subCategory');
      }
    })
  }
}
