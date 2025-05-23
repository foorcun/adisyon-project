import { BehaviorSubject } from 'rxjs';
import { MyConfiguration } from '../domain/entities/my-configuration.entity';
import { Database, ref, set, get, child, onValue, push, remove, update } from '@angular/fire/database';
import { MyConfigurationMapper } from '../domain/entities/my-configuration.mapper';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class MyConfigurationFirebaseRepository {
    private basePath = 'myConfiguration';
    private configSubject = new BehaviorSubject<MyConfiguration>(new MyConfiguration('#000000'));
    config$ = this.configSubject.asObservable();
    userKey = 'menuKey_zeuspub';

    constructor(
        private database: Database
    ) {
    }
    getConfigFieldVariable() {
        this.config$.subscribe(config => console.log("[MyConfigurationFirebaseRepository] config$:", config));
        return this.config$;
    }
    listenForConfigChanges() {
        const configRef = ref(this.database, `${this.basePath}/${this.userKey}`);
        onValue(configRef, (snapshot) => {
            const configData = snapshot.val();
            console.log("[MyConfigurationFirebaseRepository]" + configData)
            const transformedConfig = MyConfigurationMapper.fromJson(configData);
            console.log("[MyConfigurationFirebaseRepository] listenForConfigChanges:", transformedConfig);
            this.configSubject.next(transformedConfig);
        });
    }



    // addConfig(userKey: string, value: MyConfiguration) {
    //     const configRef = ref(this.database, `my-configuration/${userKey}`);
    //     set(configRef, value)
    //         .then(() => console.log('Config added successfully!'))
    //         .catch((error) => console.error('Error adding config:', error));
    // }

    // clearConfig(userKey: string): Observable<void> {
    //     console.log("[MyConfigurationFirebaseRepository] clearConfig:", userKey);
    //     const configRef = ref(this.database, `my-configuration/${userKey}`);
    //     return from(remove(configRef));
    // }

    // updateConfig(userKey: string, newConfig: MyConfiguration): Observable<void> {
    //     const configRef = ref(this.database, `my-configuration/${userKey}`);
    //     return from(update(configRef, newConfig));
    // }


}