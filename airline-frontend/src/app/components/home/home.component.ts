import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchCriteria = {
    origin: '',
    destination: '',
    date: ''
  };

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchCriteria.origin && this.searchCriteria.destination && this.searchCriteria.date) {
      this.router.navigate(['/search'], { queryParams: this.searchCriteria });
    }
  }
}
