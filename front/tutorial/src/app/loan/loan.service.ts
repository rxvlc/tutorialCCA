import { Injectable, OnInit } from '@angular/core';
import { Loan } from './model/Loan';
import { LoanPage } from './model/LoanPage';
import { Pageable } from '../core/model/page/Pageable';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GameService } from '../game/game.service';
import { CategoryService } from '../category/category.service';
import { Game } from '../game/model/Game';
import { Client } from '../client/model/Client';


@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private baseUrl = 'http://localhost:8080/loan';

  constructor(private http: HttpClient) { }

  getLoans(pageable: Pageable, gameId?: Game, clientId?: Client, date?: Date): Observable<LoanPage> {
    const gameIdValue = gameId?.id ?? null;
    const clientIdValue = clientId?.id ?? null;
    const dateValue = date ?? null;

    return this.http.post<LoanPage>(this.composeUrl(gameIdValue, clientIdValue, dateValue), { pageable: pageable });
  }


  saveLoan(loan: Loan): Observable<any> {
    return this.http.put(this.baseUrl, loan);
  }

  deleteLoan(loanId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${loanId}`);
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-CA', options);
  }


  private composeUrl(gameId?: number, clientId?: number, date?: Date): string {
    const params = new URLSearchParams();
    if (clientId) {
      params.set('clientId', clientId.toString());
    }
    if (gameId) {
      params.set('gameId', gameId.toString())
    }
    if (date) {
      params.set('date', this.formatDate(date))
    }
    const queryString = params.toString();
    return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
  }


}
