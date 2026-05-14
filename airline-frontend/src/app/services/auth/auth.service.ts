import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  username: string;
  role: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiGatewayUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<AuthUser | null>(this.getStoredUser());

  isLoggedIn$ = this.loggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser(): AuthUser | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  private storeAuth(res: any): void {
    if (res && res.token) {
      localStorage.setItem('token', res.token);
      const user: AuthUser = {
        username: res.username || res.email || 'User',
        role: res.role || 'User',
        email: res.email
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.loggedIn.next(true);
      this.currentUser.next(user);
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => this.storeAuth({ ...res, username: credentials.username }))
    );
  }

  register(data: { username: string; password: string; email?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => this.storeAuth({ ...res, username: data.username }))
    );
  }

  staffLogin(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/login`, credentials).pipe(
      tap((res: any) => this.storeAuth({ ...res, username: credentials.username }))
    );
  }

  staffRegister(data: { username: string; password: string; email?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/register`, data).pipe(
      tap((res: any) => this.storeAuth({ ...res, username: data.username }))
    );
  }

  loginWithGoogle(): void {
    // Redirect the browser to the backend Google OAuth endpoint
    const returnUrl = encodeURIComponent(window.location.origin);
    window.location.href = `${this.apiUrl}/login-google?returnUrl=${returnUrl}`;
  }

  handleGoogleCallback(token: string, role: string, email: string): void {
    const res = { token, role, username: email, email };
    this.storeAuth(res);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser.value;
  }

  isStaff(): boolean {
    const user = this.currentUser.value;
    return user?.role === 'AirlineStaff' || user?.role === 'Admin';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this.currentUser.next(null);
  }
}
