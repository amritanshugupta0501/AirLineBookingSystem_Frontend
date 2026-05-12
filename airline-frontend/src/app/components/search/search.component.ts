import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlightService, Flight } from '../../services/flight/flight.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  origin = '';
  destination = '';
  date = '';
  flights: Flight[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute, 
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.origin = params['origin'] || '';
      this.destination = params['destination'] || '';
      this.date = params['date'] || '';

      if (this.origin && this.destination && this.date) {
        this.fetchFlights();
      } else {
        this.loading = false; // Missing params, handle UI accordingly
      }
    });
  }

  fetchFlights() {
    this.loading = true;
    this.flightService.searchFlights(this.origin, this.destination, this.date)
      .subscribe(results => {
        this.flights = results;
        this.loading = false;
      });
  }

  bookFlight(flight: Flight) {
    // Navigate to booking page and pass flight ID
    this.router.navigate(['/booking'], { queryParams: { flightId: flight.id } });
  }
}
