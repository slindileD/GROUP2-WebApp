import { HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Survey } from 'src/app/Interface/survey.types';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { CustomErrorSnackBarComponent } from 'src/app/shared/components/custom-error-snack-bar/custom-error-snack-bar.component';

@Component({
  selector: 'app-delete-survey-dialog',
  templateUrl: './delete-survey-dialog.component.html',
  styleUrls: ['./delete-survey-dialog.component.css']
})
export class DeleteSurveyDialogComponent implements OnInit {
  displayProgressSpinner = false;

  record: Survey;

  constructor(
    public dialogRef: MatDialogRef<DeleteSurveyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) dataFromParent: any,
    private _matSnackBar: MatSnackBar,
    private _surveyService: SurveyService) {
    this.record = dataFromParent.record as Survey;
  }

  ngOnInit(): void {
  }

  onSubmit() {

    this._surveyService.delete(this.record.id)
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.Sent) {
            this.displayProgressSpinner = true;
          }
          if (event.type == HttpEventType.Response) {
            this.displayProgressSpinner = false;

            this.openSnackBar("Delete Survey", "Success");
            this.closeDialog();
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

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  openSnackBar(message: string, action: string) {
    this._matSnackBar.open(message, action, {
      duration: 3000,
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
