import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface FlightSchedule {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  delayReason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = `${environment.apiGatewayUrl}/schedule`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getFlights(): Observable<FlightSchedule[]> {
    return this.http.get<FlightSchedule[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  scheduleFlight(flightData: FlightSchedule): Observable<FlightSchedule> {
    return this.http.post<FlightSchedule>(this.apiUrl, flightData, { headers: this.getAuthHeaders() });
  }

  updateFlightStatus(flightNumber: string, statusData: { status: string; delayReason?: string }): Observable<FlightSchedule> {
    return this.http.put<FlightSchedule>(`${this.apiUrl}/${flightNumber}/status`, statusData, { headers: this.getAuthHeaders() });
  }
}
