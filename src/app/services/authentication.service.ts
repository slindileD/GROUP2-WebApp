import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { CurrentUser, TokenResponse } from '../Interface/Interface';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UserRoleListComponent } from '../components/user-role/user-role-list/user-role-list.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  endpointBase = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  get currentUser() {
    let token = localStorage.getItem('token');
    if (!token) return null;

    const helper = new JwtHelperService();
    return helper.decodeToken(token) as CurrentUser;
  }

  login(payload) {
    return this.http
      .post(this.endpointBase.concat("Account/LogIn"), payload, { reportProgress: true, observe: 'events' });
  }



  ForgotPassword(email) {
    return this.http.get(this.endpointBase.concat("Account/ForgotPassword/") + email, { reportProgress: true, observe: 'events' });
  }

  ResetPassword(payload) {
    return this.http.post(this.endpointBase.concat("Account/ResetPassword"), payload, { reportProgress: true, observe: 'events' });
  }

  signOut() {
    window.location.replace("");
    localStorage.removeItem('token');
  }

  isSignedIn() {
    let token = localStorage.getItem('token');
    if (!token) return false;

    const helper = new JwtHelperService();
    if (helper.isTokenExpired(token)) return false;

    return true;
  }

  storeUserNameInLocalStorage(username: string) {
    localStorage.setItem('username', username);
  }
  getUserNameFromLocalStorage() {
    return localStorage.getItem('username');
  }
}
