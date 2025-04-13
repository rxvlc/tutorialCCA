import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './model/Client';
import { HttpClient } from '@angular/common/http';
import { Category } from '../category/model/Category';



@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8080/client';

  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }
  saveClient(client: Client): Observable<any> {
    const { id } = client;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Category>(url, client);
  }
  deleteClient(clientId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${clientId}`);
  }
}
