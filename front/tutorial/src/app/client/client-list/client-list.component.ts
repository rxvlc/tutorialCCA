import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Client } from '../model/Client';
import { ClientService } from '../client.service';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ClientEditComponent } from '../client-edit/client-edit.component';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';



@Component({
  selector: 'app-client-list',
  imports: [MatIconModule, MatButtonModule, MatTableModule, CommonModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent {
  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(private clientService: ClientService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(clients => this.dataSource.data = clients);
  }

  getClients(): Observable<Client[]> {
    console.log(this.clientService.getClients());

    return this.clientService.getClients();
  }

  saveClient(client: Client): Observable<Client> {
    return of(null);
  }

  deleteClient(client: Client): Observable<any> {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar categoría", description: "Atención si borra la categoría se perderán sus datos.<br> ¿Desea eliminar la categoría?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClient(client.id).subscribe(result => { this.ngOnInit() })
      }
    })
    return of(null);
  }

  createClient() {
    const dialogRef = this.dialog.open(ClientEditComponent, { data: {} });

    dialogRef.afterClosed().subscribe(result => { this.ngOnInit() });
  }

  editClient(client: Client) {
    const dialogRef = this.dialog.open(ClientEditComponent, {
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }



}
