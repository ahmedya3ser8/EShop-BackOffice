import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-image-upload',
  imports: [FileUploadModule, TableModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  private readonly toastr = inject(ToastrService);

  @Input() maxFileSize: number = 5000000; // 5MB
  @Input() imageRatio: string = '1/1';
  @Input() imageExample: string = '600px * 600px';
  @Input() label: string = 'Upload Image';

  imagePreview: string | null = null;
  maxFileSizeInMB: string = (this.maxFileSize / 1_000_000).toFixed(1);

  @Output() imageChange = new EventEmitter<File | null>();

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

    this.imageChange.emit(file);

    // create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeUploadedImage(): void {
    this.imagePreview = null;
    this.imageChange.emit(null);
  }
}
