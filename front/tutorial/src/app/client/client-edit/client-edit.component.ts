import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../category/model/Category';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../model/Client';
import { ClientService } from '../client.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-client-edit',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent implements OnInit {

  client: Client;
  hasError: Boolean;
  errorContent: string;

  constructor(public dialogRef: MatDialogRef<ClientEditComponent>,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client }, private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.client = this.data.client != null ? Object.assign({}, this.data.client) : new Client();
  }

  onSave() {
    this.clientService.saveClient(this.client).subscribe({
      next: (response) => {
        this.toastr.success('Cliente guardado exitosamente');
        this.dialogRef.close();
      },
      error: (error) => {
        this.hasError = true;
        this.errorContent = "Ha habido un problema al guardar el cliente, revisa que no haya un cliente con el mismo nombre";
        this.toastr.error(this.errorContent);
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
