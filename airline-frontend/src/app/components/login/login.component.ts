import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

type AuthMode = 'login' | 'register' | 'staff-login' | 'staff-register';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mode: AuthMode = 'login';

  credentials = { username: '', password: '' };
  registerData = { username: '', email: '', password: '', confirmPassword: '' };
  staffCredentials = { username: '', password: '' };
  staffRegisterData = { username: '', email: '', password: '', confirmPassword: '' };

  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  setMode(mode: AuthMode) {
    this.mode = mode;
    this.error = '';
    this.success = '';
  }

  onLogin() {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Please enter username and password.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid username or password.';
      }
    });
  }

  onRegister() {
    if (!this.registerData.username || !this.registerData.password) {
      this.error = 'Username and password are required.';
      return;
    }
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.register({
      username: this.registerData.username,
      password: this.registerData.password,
      email: this.registerData.email
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created! Redirecting...';
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Try a different username.';
      }
    });
  }

  onStaffLogin() {
    if (!this.staffCredentials.username || !this.staffCredentials.password) {
      this.error = 'Please enter staff username and password.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.staffLogin(this.staffCredentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid staff credentials.';
      }
    });
  }

  onStaffRegister() {
    if (!this.staffRegisterData.username || !this.staffRegisterData.password) {
      this.error = 'Username and password are required.';
      return;
    }
    if (this.staffRegisterData.password !== this.staffRegisterData.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.staffRegister({
      username: this.staffRegisterData.username,
      password: this.staffRegisterData.password,
      email: this.staffRegisterData.email
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Staff account created! Redirecting...';
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Check your details.';
      }
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
