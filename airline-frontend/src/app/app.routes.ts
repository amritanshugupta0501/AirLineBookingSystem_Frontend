import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/login/login.component';
import { BookingComponent } from './components/booking/booking.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { StaffDashboardComponent } from './components/staff-dashboard/staff-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'staff-dashboard', component: StaffDashboardComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: '' }
];
