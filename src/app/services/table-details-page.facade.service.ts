import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableDetailsPageFacadeService {

  constructor() { }

  heartBeat(){
    console.log("[TableDetailsPageFacadeService] - Heartbeat, I'm alive!");
  }
}
