import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking/booking.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  flightId: string | null = null;
  passenger = {
    firstName: '',
    lastName: '',
    passportNumber: ''
  };
  loading = false;
  success = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']); // Require login to book
      }
    });

    this.route.queryParams.subscribe(params => {
      this.flightId = params['flightId'];
      if (!this.flightId) {
        this.router.navigate(['/search']); // Redirect if no flight selected
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    
    const request = {
      flightId: this.flightId,
      passengers: [this.passenger]
    };

    this.bookingService.bookFlight(request).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Booking failed. Please try again.';
      }
    });
  }
}
