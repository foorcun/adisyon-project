import { Injectable } from '@angular/core';
import { Database, ref, get, child } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class HelloFirebaseRepository {
    private baseUrl = 'https://adisyon-project-default-rtdb.europe-west1.firebasedatabase.app/';

    constructor(private database: Database) {}

    getHelloFirebase(): Observable<string> {
        const helloRef = ref(this.database, 'helloFirebase');
        return from(get(helloRef)).pipe(
            map((snapshot) => {
                if (snapshot.exists()) {
                    return snapshot.val();
                } else {
                    throw new Error('helloFirebase attribute does not exist.');
                }
            }),
            catchError((error) => {
                console.error('Error fetching helloFirebase:', error);
                throw error;
            })
        );
    }
}
