import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ITableCol } from '@features/admin';

@Component({
  selector: 'app-data-view',
  imports: [TableModule, FormsModule],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss'
})
export class DataViewComponent {
  @Input({ required: true }) data: any[] = [];
  @Input({ required: true }) columns: ITableCol[] = [];
  @Input() rows: number = 5;
  @Input() totalRecords: number = 0;
  @Input() lazy: boolean = true;
  @Input() loading: boolean = false;

  @Input() allowView: boolean = true;
  @Input() allowEdit: boolean = true;
  @Input() allowDelete: boolean = true;

  @Output() onPageChange = new EventEmitter<any>();
  @Output() onSort = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
}
