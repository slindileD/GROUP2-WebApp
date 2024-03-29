import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Child } from 'src/app/Interface/child.types';
import { ChildService } from 'src/app/services/child/child.service';
import { EnrollmentService } from 'src/app/services/enrollment/enrollment.service';
import { CustomErrorSnackBarComponent } from 'src/app/shared/components/custom-error-snack-bar/custom-error-snack-bar.component';
import { AddEnrollmentComponent } from '../../enrollments/add-enrollment/add-enrollment.component';

@Component({
  selector: 'app-list-all-children',
  templateUrl: './list-all-children.component.html',
  styleUrls: ['./list-all-children.component.css']
})
export class ListAllChildrenComponent implements OnInit {
  displayProgressSpinner = false;
  dataSource;

  displayedColumns: string[] = ['gender', 'name', 'surname', 'dateOfBirth', 'age', 'className', 'actions'];

  children: Child[] = [];
  child: Child;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _childService: ChildService,
    private _enrollmentService: EnrollmentService,
    private _router: Router

  ) {
  }

  ngOnInit(): void {
    this._getDataFromServer();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onViewDetails(child: Child) {
    this._router.navigate(['parent-details', child.parentEmailAddress]);
  }

  onErollCildToClass(child: Child) {
    let dialogRef = this._matDialog.open(AddEnrollmentComponent, {
      width: "80%",
      height: "auto",
      data: {
        record: child
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      this._getDataFromServer();
    });
  }

  onRemoveChildFromClass(child: Child) {
    this._enrollmentService.delete(child.id)
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.Sent) {
            this.displayProgressSpinner = true;
          }
          if (event.type == HttpEventType.Response) {
            this.displayProgressSpinner = false;
            this._getDataFromServer();
            this._openSnackBar("Remove child from class", "Success", 3000);

          }
        },
        error: (error) => {
          this.displayProgressSpinner = false;
          this._openErrorMessageSnackBar(error.error.message);
        },
        complete: () => {
          this.displayProgressSpinner = false;
        }
      })
  }

  private _getDataFromServer() {
    this._childService.getAll()
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.Sent) {
            this.displayProgressSpinner = true;
          }
          if (event.type == HttpEventType.Response) {
            const res = event.body as Child[];
            this.children = res;
            this.dataSource = new MatTableDataSource<Child>(this.children);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.displayProgressSpinner = false;
          }
        },
        error: (error) => {
          this.displayProgressSpinner = false;
          this._openErrorMessageSnackBar(error.error.message);
        },
        complete: () => {
          this.displayProgressSpinner = false;

        }
      });
  }

  private _openSnackBar(message: string, action: string, _duration: number) {
    this._snackBar.open(message, action, {
      duration: _duration,
    });
  }

  private _openErrorMessageSnackBar(errorMessage: string) {
    const snackBar = this._snackBar.openFromComponent(CustomErrorSnackBarComponent, {
      data: {
        preClose: () => { snackBar.dismiss() },
        parent: errorMessage
      }
    });
  }


}

