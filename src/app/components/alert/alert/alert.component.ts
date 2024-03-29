import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

import { Alert, AlertType } from 'src/app/models';
import { AlertService } from 'src/app/services/alert.service';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
    @Input() id = 'default-alert';
    @Input() fade = true;

    alerts: Alert[] = [];
    private subscription!: Subscription;
    routeSubscription!: Subscription;
    message: any;

    constructor(private router: Router, private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.onAlert(this.id)
        .subscribe((alert:any) => {
            // clear alerts when an empty alert is received
            if (!alert.message) {
                // filter out alerts without 'keepAfterRouteChange' flag
                this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

                // remove 'keepAfterRouteChange' flag on the rest
                this.alerts.forEach(x => delete x.keepAfterRouteChange);
                return;
            }

            // add alert to array
            this.alerts.push(alert);

            // auto close alert if required
            if (alert.autoClose) {
                setTimeout(() => this.removeAlert(alert), 3000);
            }
       });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    removeAlert(alert: Alert) {
        // check if already removed to prevent error on auto close
        if (!this.alerts.includes(alert)) return;

        if (this.fade) {
            // fade out alert
            alert.fade = true;

            // remove alert after faded out
            setTimeout(() => {
                this.alerts = this.alerts.filter(x => x !== alert);
            }, 250);
        } else {
            // remove alert
            this.alerts = this.alerts.filter(x => x !== alert);
        }
    }
    cssClass(alert: Alert) {
        if (!alert) return;

        const classes = ['alert', 'alert-dismissable', 'mt-4', 'container'];

        const alertTypeClass = {
            [AlertType.Success]: 'alert alert-success',
            [AlertType.Error]: 'alert alert-danger',
            [AlertType.Info]: 'alert alert-info',
            [AlertType.Warning]: 'alert alert-warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }
}
