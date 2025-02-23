import { Component, OnInit } from '@angular/core';
import { HelloFirebaseRepository } from '../../HelloFirebaseFeature/infrastructure/hello-firebase.repository';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-home-page',
  templateUrl: './test-home-page.component.html',
  styleUrl: './test-home-page.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class TestHomePageComponent implements OnInit {
  helloMessage: string | null = null;

  constructor(private helloFirebaseRepository: HelloFirebaseRepository) {}

  ngOnInit(): void {
    this.helloFirebaseRepository.getHelloFirebase().subscribe({
      next: (message) => {
        this.helloMessage = message;
      },
      error: (error) => {
        console.error('Error fetching message:', error);
      }
    });
  }
}
