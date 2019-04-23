import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice';
import { Router } from '@angular/router';
import { MatSnackBar, MatPaginator } from '@angular/material';
import { remove } from 'lodash';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-listing',
  templateUrl: './invoice-listing.component.html',
  styleUrls: ['./invoice-listing.component.scss']
})
export class InvoiceListingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['item', 'date', 'due', 'qty', 'rate', 'tax', 'action'];
  dataSource: Invoice[] = [];
  resultsLength = 0;
  isResultsLoading = false;

  constructor(private invoiceService: InvoiceService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isResultsLoading = true;
    this.paginator.page
      .pipe(
        mergeMap(data => {
          this.isResultsLoading = true;
          return this.invoiceService.getInvoices({
            page: data.pageIndex + 1,
            perPage: data.pageSize
          });
        })
      )
      .subscribe(
        data => {
          this.dataSource = data.docs;
          this.resultsLength = data.total;
          this.isResultsLoading = false;
        },
        err => {
          this.errorHandler(err, 'Failed to delete invoice');
        }
      );

    this.populateInvoices();
  }

  createBtnHandler() {
    this.router.navigate(['dashboard', 'invoices', 'new']);
  }

  editBtnHandler(id) {
    this.router.navigate(['dashboard', 'invoices', id]);
  }

  deleteBtnHandler(id) {
    this.invoiceService.deleteInvoice(id).subscribe(
      data => {
        const removedItems = remove(this.dataSource, item => {
          return item._id === data._id;
        });
        this.dataSource = [...this.dataSource];
        this.snackBar.open('Invoice deleted', 'Success', {
          duration: 3000
        });
      },
      err => this.errorHandler(err, 'Failed to delete invoice')
    );
  }

  private populateInvoices() {
    this.isResultsLoading = true;
    this.invoiceService.getInvoices({ page: 1, perPage: 10 }).subscribe(
      data => {
        this.dataSource = data.docs;
        this.resultsLength = data.total;
      },
      err => this.errorHandler(err, 'Failed to fetch invoices'),
      () => {
        this.isResultsLoading = false;
      }
    );
  }
  private errorHandler(error, message) {
    console.error(error);
    this.isResultsLoading = false;
    this.snackBar.open(message, 'Error', {
      duration: 3000
    });
  }
}
