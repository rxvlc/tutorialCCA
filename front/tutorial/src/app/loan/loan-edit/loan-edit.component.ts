import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Loan } from '../model/Loan';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanService } from '../loan.service';
import { GameService } from '../../game/game.service';
import { ClientService } from '../../client/client.service';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  templateUrl: './loan-edit.component.html',
  styleUrls: ['./loan-edit.component.scss']
})
export class LoanEditComponent implements OnInit {

  @ViewChild('dateStartPicker') dateStartPicker: MatDatepicker<Date>;
  @ViewChild('dateEndPicker') dateEndPicker: MatDatepicker<Date>;

  loan: Loan;
  games: Game[];
  clients: Client[];

  error: boolean = false;
  errorMessage: String

  constructor(
    public dialogRef: MatDialogRef<LoanEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loanService: LoanService,
    private gameService: GameService,
    private clientService: ClientService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Loan();

    this.gameService.getGames().subscribe((games) => {
      this.games = games;
      if (this.loan.game) {
        const gameFilter = games.find(game => game.id === this.data.loan.game.id);
        if (gameFilter) {
          this.loan.game = gameFilter[0];
        }
      }
    });

    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;
      if (this.loan.client) {
        const clientFilter = clients.find(client => client.id === this.data.loan.client.id);
        if (clientFilter) {
          this.loan.client = clientFilter[0];
        }
      }
    });
  }

  onSave() {
    this.loanService.saveLoan(this.loan).subscribe({
      next: (result) => {
        this.toastr.success('Prestamo guardado exitósamente');
        this.dialogRef.close();
      },
      error: (error) => {
        this.error = true;
        this.errorMessage = error.error.error
        console.log(this.errorMessage)
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}