import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SNACKBAR_CONFIG } from "../../models/constants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static TOKEN_KEY = 'BHUMI_JWT_TOKEN';
  static AUTHENTICATED_USER = 'BHUMI_AUTHENTICATED_USER';

  constructor(private route: Router,
              private httpClient: HttpClient,
              private snackBar: MatSnackBar) { }

  // TODO: HAVE A COOKIE WITH JWT INSTEAD
  private static createAuthenticatedSession(jwt: string, email: string) {
    localStorage.setItem(AuthService.TOKEN_KEY, jwt);
    localStorage.setItem(AuthService.AUTHENTICATED_USER, email);
  }

  private static hasAuthenticatedSession(): boolean {
    return !!localStorage.getItem(AuthService.TOKEN_KEY);
  }

  private static clearAuthenticatedSession() {
    localStorage.clear();
  }

  login(credentials: any) {
    this.httpClient.post(`${environment.backendUrl}/signin`, credentials).subscribe(
      (response: any) => {
        if (response.success) {
          AuthService.createAuthenticatedSession(response.token, credentials.email);
          this.route.navigate(['/']);
        } else {
          this.snackBar.open(response.msg, "Dismiss", SNACKBAR_CONFIG);
        }
      },
      (error: any) => {
        this.snackBar.open(error.msg, "Dismiss", SNACKBAR_CONFIG);
      });
  }

  createAccount(user: any) {
    this.httpClient.post(`${environment.backendUrl}/signup`, user).subscribe(
      (success: any) => {
        this.snackBar.open(success.msg, "Dismiss", SNACKBAR_CONFIG);
        if (success.success) {
          this.route.navigate(['/login']);
        }
      },
      (error: any) => {
        this.snackBar.open(error.msg, "Dismiss", SNACKBAR_CONFIG);
      });
  }

  forgotPassword(username: string) {
    this.httpClient.get(`${environment.backendUrl}/forgotPassword/${username}`).subscribe(
      (success: any) => {
        this.snackBar.open(success.msg, "Dismiss", SNACKBAR_CONFIG);
        if (success.success) {
          this.route.navigate(['/login']);
        }
      },
      (error: any) => {
        this.snackBar.open(error.msg, "Dismiss", SNACKBAR_CONFIG);
      });
  }

  logout() {
    AuthService.clearAuthenticatedSession();
    this.route.navigate(['/login']);
  }

  isUserAuthenticated() {
    return AuthService.hasAuthenticatedSession();
  }

  getAuthenticatedUserName(): string {
    return localStorage.getItem(AuthService.AUTHENTICATED_USER)!;
  }

  getAuthToken() {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }
}
