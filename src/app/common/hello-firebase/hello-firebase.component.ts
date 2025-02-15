import { Component } from '@angular/core';
import { HelloFirebaseRepository } from '../../HelloFirebaseFeature/infrastructure/hello-firebase.repository';

@Component({
  selector: 'app-hello-firebase',
  imports: [],
  templateUrl: './hello-firebase.component.html',
  styleUrl: './hello-firebase.component.scss'
})
export class HelloFirebaseComponent {
  helloMessage: string = '';

  constructor(private helloFirebaseRepository: HelloFirebaseRepository) { }

  ngOnInit(): void {
    this.helloFirebaseRepository.getHelloFirebase().subscribe({
      next: (data) => {
        this.helloMessage = data;
        console.log('Firebase says:', data);
      },
      error: (error) => {
        this.helloMessage = 'Failed to fetch message.';
        console.error('Error fetching helloFirebase:', error);
      }
    });
  }
}
