import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = environment.wideServerApiUrl;

  constructor(private http: HttpClient) { }

  getHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/get`, { withCredentials: true });
  }

  getHistoryKey(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/key`, { withCredentials: true });
  }

  getHistoryMessage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/generate_message`, { withCredentials: true });
  }

  setHistoryKey(signature: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/history/register_key`, { signature: signature }, { withCredentials: true });
  }

  hasHistoryKey(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/hasKey`, { withCredentials: true });
  }

  logPresentation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/history/logPresentation`, data, { withCredentials: true });
  }
  
}
