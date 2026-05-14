import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService, FlightSchedule } from '../../services/staff/staff.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-dashboard.component.html',
  styleUrl: './staff-dashboard.component.css'
})
export class StaffDashboardComponent implements OnInit {
  flights: FlightSchedule[] = [];
  
  newFlight: FlightSchedule = {
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    status: 'Scheduled'
  };

  loading = false;
  loadingFlights = false;
  error = '';
  success = '';

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights() {
    this.loadingFlights = true;
    this.staffService.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
        this.loadingFlights = false;
      },
      error: (err) => {
        this.error = 'Failed to load flights: ' + (err?.error?.message || err.message);
        this.loadingFlights = false;
      }
    });
  }

  onScheduleFlight() {
    if (!this.newFlight.flightNumber || !this.newFlight.origin || !this.newFlight.destination || !this.newFlight.departureTime || !this.newFlight.arrivalTime) {
      this.error = 'Please fill in all flight details.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.staffService.scheduleFlight(this.newFlight).subscribe({
      next: (flight) => {
        this.loading = false;
        this.success = `Flight ${flight.flightNumber} scheduled successfully!`;
        this.loadFlights(); // Refresh list
        
        // Reset form
        this.newFlight = {
          flightNumber: '',
          origin: '',
          destination: '',
          departureTime: '',
          arrivalTime: '',
          status: 'Scheduled'
        };

        // Clear success message after 3 seconds
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to schedule flight: ' + (err?.error?.message || err.message);
      }
    });
  }
}
