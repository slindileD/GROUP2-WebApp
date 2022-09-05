import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import jsPDF from "jspdf";
import "jspdf-autotable";
import domtoimage from 'dom-to-image';
import { ConsumableByChild } from 'src/app/Interface/reports.types';
import { ReportingService } from 'src/app/services/reporting/reporting.service';
import { CustomErrorSnackBarComponent } from 'src/app/shared/components/custom-error-snack-bar/custom-error-snack-bar.component';
import { MixpanelService } from 'src/app/services/mixpanel/mixpanel.service';

@Component({
  selector: 'app-consumables-by-child-report',
  templateUrl: './consumables-by-child-report.component.html',
  styleUrls: ['./consumables-by-child-report.component.css']
})
export class ConsumablesByChildReportComponent implements OnInit {
  displayProgressSpinner = false;

  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
  yyyy = this.today.getFullYear();
  time = this.today.toLocaleTimeString();

  dateGenerated = this.dd + '-' + this.mm + '-' + this.yyyy;

  @ViewChild('content') content: ElementRef;

  multipleData: ConsumableByChild[];


  constructor(
    private _reportingService: ReportingService,
    private _router: Router,
    private _matSnackBar: MatSnackBar,
    private _mixpanelService:MixpanelService

  ) {
    this._mixpanelService.track("View Consumables By Child Report");
  }

  ngOnInit(): void {

    this._getApplicationFromServer();
  }

  private _getApplicationFromServer() {
    this._reportingService.getConsumablesByChild()
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.Sent) {
            this.displayProgressSpinner = true;
          }
          if (event.type == HttpEventType.Response) {

            this.multipleData = event.body as ConsumableByChild[];

            console.log(this.multipleData)

            this.displayProgressSpinner = false;
          }
        },
        error: (error) => {
          this.displayProgressSpinner = false;
          this._openErrorMessageSnackBar(error.error.message)
        },
        complete: () => {
          this.displayProgressSpinner = false;
        }
      });
  }

  public downloadAsPDF() {
    let div = this.content.nativeElement;

    var img: any;
    var filename;
    var newImage: any;

    domtoimage.toPng(div, { bgcolor: '#fff' })
      .then(function (dataUrl) {

        img = new Image();
        img.src = dataUrl;
        newImage = img.src;

        img.onload = function () {

          var pdfWidth = img.width;
          var pdfHeight = img.height;

          var doc;

          if (pdfWidth > pdfHeight) {
            doc = new jsPDF('l', 'px', [pdfWidth, pdfHeight]);
          }
          else {
            doc = new jsPDF('p', 'px', [pdfWidth, pdfHeight]);
          }

          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();

          doc.addImage(newImage, 'PNG', 10, 10, width, height);

          filename = 'consumables_by_child_report' + '.pdf';
          doc.save(filename);

        };


      })
      .catch(function (error) {
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
