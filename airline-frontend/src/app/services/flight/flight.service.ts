import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Flight {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  price: number;
  airline: string;
  seatsAvailable: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = `${environment.apiGatewayUrl}/api/flightsearch`; // Points to ApiGateway

  constructor(private http: HttpClient) {}

  searchFlights(origin: string, destination: string, date: string): Observable<Flight[]> {
    const params = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('date', date);

    return this.http.get<Flight[]>(`${this.apiUrl}/oneway`, { params })
      .pipe(
        catchError(this.handleError<Flight[]>('searchFlights', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Returning empty result so app keeps running
      return of(result as T);
    };
  }
}
