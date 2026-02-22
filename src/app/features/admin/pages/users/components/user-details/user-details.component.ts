import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MainTitleComponent } from "@shared/components";
import { UsersService } from '../../services/users.service';
import { IUser } from '../../models/iuser';

@Component({
  selector: 'app-user-details',
  imports: [MainTitleComponent, RouterLink],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly usersService = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  userId!: string;
  userData: IUser = {} as IUser;

  ngOnInit(): void {
    this.getId();
  }

  getId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.userId = param.get('id')!;
        this.getUser(this.userId);
      }
    })
  }

  getUser(id: string): void {
    this.usersService.getUser(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.userData = res.data;
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Failed to fetch user');
      }
    })
  }
}
