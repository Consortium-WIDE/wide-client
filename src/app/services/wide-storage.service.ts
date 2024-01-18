import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WideStorageService {

  private apiUrl = environment.wideServerApiUrl; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Fetch the primary public key for a user
  getPublicKey(accountAddress: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${accountAddress}/publicKey`, { withCredentials: true });
  }

  // POST method: Set a user's public key
  setPublicKey(accountAddress: string, publicKey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${accountAddress}/publicKey`, { publicKey }, { withCredentials: true });
  }

  getUserIssuedCredentials(accountAddress: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.apiUrl}/storage/user/${accountAddress}/issued-credentials`, { observe: 'response', withCredentials: true });
  }

  storeUserCredentials(accountAddress: string, issuer: any, rawPayloadHash: string, credential: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/storage/user/${accountAddress}/credential`, {
      'issuer': issuer, //The dataset representing the Issuer and info on the issuance of the credentials
      'payload': credential.payload, //The entire set of credentials ('payload') in encrypted format
      'rawPayloadHash': rawPayloadHash,//The hash of the entire raw payload
      'credentials': credential.credentials //The credentials encrypted separately
    }, { withCredentials: true });
  }

  getEncryptedCredentials(accountAddress: string, credentialKey: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.apiUrl}/storage/user/${accountAddress}/credentials/${credentialKey}`, { observe: 'response', withCredentials: true });
  }

}
