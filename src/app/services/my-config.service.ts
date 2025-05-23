import { BehaviorSubject } from "rxjs";
import { MyConfigurationFirebaseRepository } from "../ConfigurationFeature/infrastructure/my-configuration-firebase.repository";
import { MyConfiguration } from "../ConfigurationFeature/domain/entities/my-configuration.entity";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class MyConfigService {

    private configSubject = new BehaviorSubject<MyConfiguration>(new MyConfiguration('#000000'));
    config$ = this.configSubject.asObservable();

    constructor(
        private myConfigurationRepository: MyConfigurationFirebaseRepository,
    ) {
        this.myConfigurationRepository.listenForConfigChanges(); // 🔥 Listen immediately when the service is initialized
    }

}