import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { BrandsService } from '../../services/brands.service';
import { IBrandData } from '../../models/ibrand';
import { MainTitleComponent } from "@shared/components";

import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

interface IColumn {
  field: string;
  header: string;
  isImage?: boolean;
}

@Component({
  selector: 'app-brand-list',
  imports: [MainTitleComponent, FileUploadModule, TableModule, FormsModule, RouterLink, ConfirmDialogModule],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly brandsService = inject(BrandsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  private searchSubject = new Subject<string>();
  brands: IBrandData[] = [];
  columns: IColumn[] = [
    { field: 'image', header: 'image', isImage: true },
    { field: 'name', header: 'Name' }
  ];

  loading: boolean = false;
  isPaginated: boolean = true;
  totalRecords = 0;
  currentPage = 1;
  limit = 5;
  sortField = '';
  keyword = '';
  fields: string = 'name,image';

  ngOnInit(): void {
    this.getAllBrands();
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (value) => {
        this.keyword = value;
        this.currentPage = 1;
        this.getAllBrands();
      }
    })
  }

  getAllBrands(): void {
    this.loading = true;
    const paginateObj = {
      currentPage: this.currentPage,
      limit: this.limit,
      sort: this.sortField,
      keyword: this.keyword,
      fields: this.fields
    }
    this.brandsService.getAllBrands(paginateObj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.brands = res.data;
          this.currentPage = res.paginationResult.currentPage;
          this.totalRecords = res.paginationResult.totalRecords;
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch all brands');
        this.loading = false;
      }
    })
  }

  onPageChange(value: { first: number; rows: number }): void {
    this.limit = value.rows;
    this.currentPage = Math.floor(value.first / value.rows) + 1;
    this.getAllBrands();
  }

  onSearch(): void {
    this.searchSubject.next(this.keyword);
  }

  onSort(event: any): void {
    if (event.sortField === 'name') {
      this.sortField = event.sortOrder === 1 ? event.sortField : `-${event.sortField}`;
      this.getAllBrands();
    }
  }

  onView(id: string): void {
    this.router.navigate(['/brands/view', id])
  }

  onEdit(id: string): void {
    this.router.navigate(['/brands/edit', id])
  }

  onDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this brand?',
      header: 'Confirm Deletion',
      icon: 'fa-solid fa-triangle-exclamation',
      acceptLabel: 'confirm',
      rejectLabel: 'cancel',
      accept: () => this.deleteBrand(id)
    })
  }

  deleteBrand(id: string): void {
    this.brandsService.deleteBrand(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('brand deleted successfully');
          this.getAllBrands();
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to delete brand');
      }
    })
  }
}
