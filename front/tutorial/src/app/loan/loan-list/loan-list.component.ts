import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { GameService } from '../../game/game.service';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule,
    CommonModule, MatPaginator, MatFormField, MatLabel, MatButtonModule, MatSelectModule, MatDatepickerModule, FormsModule, MatNativeDateModule,
    MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss',
})
export class LoanListComponent implements OnInit {


  clients: Client[];
  filterClient: Client;
  games: Game[];
  filterGame: Game;
  filterDate: Date;


  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'gameTitle', 'clientName', 'beginDate', 'endDate', 'action'];

  constructor(private loanService: LoanService, public dialog: MatDialog, private gameService: GameService, private clientService: ClientService) { }

  ngOnInit(): void {
    this.loadPage();
    this.gameService.getGames().subscribe((games) => (this.games = games));
    this.clientService.getClients().subscribe((clients) => (this.clients = clients));
  }

  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }



    this.loanService.getLoans(pageable, this.filterGame ?? null, this.filterClient ?? null, this.filterDate ?? null).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  createLoan() {
    const dialogRef = this.dialog.open(LoanEditComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deleteLoan(loan: Loan) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar prestamo',
        description:
          'Atención si borra el prestamo se perderán sus datos.<br> ¿Desea eliminar el autor?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loanService.deleteLoan(loan.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }

  onCleanFilter() {
    this.filterClient = null;
    this.filterDate = null;
    this.filterGame = null;
  }

  onSearch() {
    this.loadPage();
  }
}