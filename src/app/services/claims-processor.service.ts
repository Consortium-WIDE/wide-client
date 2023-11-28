import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClaimsProcessorService {

  constructor() { }

  public printHello() {
    console.log('Hello from ClaimsProcessorService!');
  }
}
