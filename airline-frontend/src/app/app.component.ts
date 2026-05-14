import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'airline-frontend';
  isLoggedIn = false;
  currentUser: AuthUser | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = v);
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
  }

  logout() {
    this.authService.logout();
  }

  get isStaff(): boolean {
    return this.currentUser?.role === 'AirlineStaff' || this.currentUser?.role === 'Admin';
  }

  getRoleLabel(): string {
    switch (this.currentUser?.role) {
      case 'Admin': return '👑 Admin';
      case 'AirlineStaff': return '🛂 Staff';
      default: return '👤 ' + (this.currentUser?.username || 'User');
    }
  }
}
