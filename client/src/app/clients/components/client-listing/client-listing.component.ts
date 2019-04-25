import { Component, OnInit, Inject } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Client } from '../../models/client';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { filter, mergeMap } from 'rxjs/operators';
import { remove } from 'lodash';

@Component({
  selector: 'app-client-listing',
  templateUrl: './client-listing.component.html',
  styleUrls: ['./client-listing.component.scss']
})
export class ClientListingComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'email', 'action'];
  dataSource = new MatTableDataSource<Client>();
  isResultsLoading = false;

  constructor(private clientService: ClientService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.isResultsLoading = true;
    this.clientService.getClients().subscribe(
      data => {
        console.log(data);
        this.dataSource.data = data;
      },
      err => console.error(err),
      () => (this.isResultsLoading = false)
    );
  }

  deleteBtnHandler(clientId) {
    this.clientService.deleteClient(clientId).subscribe(
      data => {
        const removedItems = remove(this.dataSource.data, item => {
          return item._id === data._id;
        });
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open('Client deleted', 'Success', {
          duration: 2000
        });
      },
      err => this.errorHandler(err, 'Failed to delete client')
    );
  }

  openDialog(clientId: string): void {
    const options = {
      width: '400px',
      height: '300px',
      data: {}
    };
    if (clientId) {
      options.data = { clientId: clientId };
    }
    const dialogRef = this.dialog.open(FormDialogComponent, options);
    dialogRef
      .afterClosed()
      .pipe(filter(clientParam => typeof clientParam === 'object'))
      .pipe(
        mergeMap(result => {
          return clientId ? this.clientService.updateClient(clientId, result) : this.clientService.createClient(result);
        })
      )
      .subscribe(
        client => {
          let successMsg = '';
          if (clientId) {
            // tslint:disable-next-line:no-shadowed-variable
            const index = this.dataSource.data.findIndex(client => client._id === clientId);
            this.dataSource.data[index] = client;
            successMsg = 'Client updated';
          } else {
            this.dataSource.data.push(client);
            successMsg = 'Client created';
          }
          this.dataSource.data = [...this.dataSource.data];
          this.snackBar.open(successMsg, 'Success', {
            duration: 2000
          });
        },
        err => this.errorHandler(err, 'Failed to created Client')
      );
  }

  private errorHandler(error, message) {
    console.error(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}
