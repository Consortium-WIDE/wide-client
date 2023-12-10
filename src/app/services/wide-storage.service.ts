import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WideStorageService {

  private apiUrl = environment.wideServerApiUrl; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Fetch the public key for a user
  getPublicKey(accountAddress: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${accountAddress}/publicKey`);
  }

  // POST method: Set a user's public key
  setPublicKey(accountAddress: string, publicKey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${accountAddress}/publicKey`, { publicKey });
  }

  // Fetch the list of VC IDs for a user
  getVcIds(accountAddress: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${accountAddress}/vcIds`);
  }

  // POST method: Add a VC ID for a user
  addVcId(accountAddress: string, vcId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${accountAddress}/vcIds`, { vcId });
  }

  // Fetch a VC by ID for a user
  getVcById(accountAddress: string, vcId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${accountAddress}/vc/${vcId}`);
  }

  // POST method: Add a VC for a user
  addVc(accountAddress: string, vcId: string, vcData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${accountAddress}/vc/${vcId}`, vcData);
  }

  // Fetch a specific claim for a VC for a user
  getClaimForVc(accountAddress: string, vcId: string, claimId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${accountAddress}/vc/${vcId}/claim/${claimId}`);
  }

  // POST method: Add a claim for a specific VC for a user
  addClaimToVc(accountAddress: string, vcId: string, claimId: string, claimData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${accountAddress}/vc/${vcId}/claim/${claimId}`, claimData);
  }


  // Fetch a claim for a user
  getClaim(accountAddress: string, claimId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${accountAddress}/claim/${claimId}`);
  }

  // POST method: Add a claim for a user
  addClaim(accountAddress: string, claimId: string, claimData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${accountAddress}/claim/${claimId}`, claimData);
  }

  // Fetch secondary addresses for a user account
  getSecondaryAddresses(accountAddress: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${accountAddress}/secondaryAddresses`);
  }

  // POST method: Add secondary addresses for a user account
  addSecondaryAddresses(accountAddress: string, secondaryAddresses: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${accountAddress}/secondaryAddresses`, { secondaryAddresses });
  }


  // Fetch the primary address for a secondary user account
  getPrimaryAddress(secondaryAddress: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${secondaryAddress}/primaryAddress`);
  }

  // POST method: Set the primary address for a secondary user account
  addPrimaryAddressForSecondary(secondaryAddress: string, primaryAddress: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/${secondaryAddress}/primaryAddress`, { primaryAddress });
  }

}
