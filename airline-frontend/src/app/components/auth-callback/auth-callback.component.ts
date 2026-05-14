import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex; justify-content:center; align-items:center; min-height:60vh; flex-direction:column; gap:16px;">
      <div class="spinner-large"></div>
      <p style="color: var(--text-muted);">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-large {
      width: 48px; height: 48px;
      border: 4px solid rgba(99,102,241,0.2);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AuthCallbackComponent implements OnInit {
  message = 'Completing sign in...';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const role = params['role'] || 'User';
      const email = params['email'] || '';
      const error = params['error'];

      if (error) {
        this.message = 'Google sign-in failed. Redirecting...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
        return;
      }

      if (token) {
        this.authService.handleGoogleCallback(token, role, email);
        this.message = 'Successfully signed in! Redirecting...';
        setTimeout(() => this.router.navigate(['/']), 1000);
      } else {
        this.message = 'No token received. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    });
  }
}
