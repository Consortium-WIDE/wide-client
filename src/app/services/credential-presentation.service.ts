import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CredentialPresentationService {
  private apiUrl = environment.wideServerApiUrl;

  constructor(private http: HttpClient) { }

  getDomainConfig(domain: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/rp/config/${domain}`);
  }
}
