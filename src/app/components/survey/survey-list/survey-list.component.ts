import { HttpEventType } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Survey } from "src/app/Interface/survey.types";
import { SurveyService } from "src/app/services/survey/survey.service";
import { CustomErrorSnackBarComponent } from "src/app/shared/components/custom-error-snack-bar/custom-error-snack-bar.component";
import { DeleteSurveyDialogComponent } from "../delete-survey-dialog/delete-survey-dialog.component";
import { EditSurveyDialogComponent } from "../edit-survey-dialog/edit-survey-dialog.component";


@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
  displayProgressSpinner = false;
  dataSource;

  displayedColumns: string[] = ['status', 'name', 'startDate', 'endDate', 'questionsCount', 'responsesCount', 'actions'];

  surveys: Survey[] = [];
  survey: Survey;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private _matSnackBar: MatSnackBar,
    private _matDialog: MatDialog,
    private _surveyService: SurveyService,
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

  onAdd() {
    this._router.navigate(['add-survey']);
  }

  onViewSurveyResponse(value: Survey) {
    this._router.navigate(['view-survey-results', value.id]);
  }

  onUpdateValue(value: Survey) {
    let dialogRef = this._matDialog.open(EditSurveyDialogComponent, {
      width: "80%",
      height: "auto",
      data: {
        record: value
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      this._getDataFromServer();
    });
  }

  onDeleteValue(value: Survey) {
    let dialogRef = this._matDialog.open(DeleteSurveyDialogComponent, {
      width: "80%",
      height: "auto",
      data: {
        record: value
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      this._getDataFromServer();
    });
  }

  private _getDataFromServer() {
    this._surveyService.getAllSurveys()
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.Sent) {
            this.displayProgressSpinner = true;
          }
          if (event.type == HttpEventType.Response) {
            const res = event.body as Survey[];
            this.surveys = res;
            this.dataSource = new MatTableDataSource<Survey>(this.surveys);
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

  openSnackBar(message: string, action: string) {
    this._matSnackBar.open(message, action, {
      duration: 2000,
    });
  }

  private _openErrorMessageSnackBar(errorMessage: string) {
    const snackBar = this._matSnackBar.openFromComponent(CustomErrorSnackBarComponent, {
      data: {
        preClose: () => { snackBar.dismiss() },
        parent: errorMessage
      }
    });
  }

}
