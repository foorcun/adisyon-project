import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FirestoreRoleRepository } from './firestore-role.repository'; // Adjust path as necessary
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

fdescribe('FirestoreRoleRepository (Real HTTP)', () => {
  let repository: FirestoreRoleRepository;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FirestoreRoleRepository],
    });
    repository = TestBed.inject(FirestoreRoleRepository);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should fetch the role of a user by UID', (done: DoneFn) => {
    console.log('######### FirestoreRoleRepository: Fetch Role by UID #########');

    const uid = 'V8XWzZAtk3gPVQ05C2letJQogBd2'; // Replace with a valid UID for testing

    spyOn(httpClient, 'get').and.returnValue(
      of({
        role: 'admin',
      })
    );

    repository.getRoleByUid(uid).subscribe((role) => {
      console.log(role);
      expect(role).toBeTruthy();
      expect(role).toBe('admin');
      console.log('Fetched role:', role);

      console.log('######### FirestoreRoleRepository: Fetch Role by UID ENDS #########');
      done();
    });
  });

  it('should return null if no role is found for the user UID', (done: DoneFn) => {
    console.log('######### FirestoreRoleRepository: Handle No Role #########');

    const uid = 'non-existent-uid'; // Replace with a UID not present in your database

    spyOn(httpClient, 'get').and.returnValue(of(null)); // Simulate no data found

    repository.getRoleByUid(uid).subscribe((role) => {
      expect(role).toBeNull();
      console.log('No role found for UID:', uid);

      console.log('######### FirestoreRoleRepository: Handle No Role ENDS #########');
      done();
    });
  });
});
