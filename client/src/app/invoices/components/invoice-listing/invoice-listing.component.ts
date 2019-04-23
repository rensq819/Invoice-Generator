import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice';
import { Router } from '@angular/router';
import { MatSnackBar, MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { remove } from 'lodash';
import { of as observableOf } from 'rxjs';
import { mergeMap, merge, catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-listing',
  templateUrl: './invoice-listing.component.html',
  styleUrls: ['./invoice-listing.component.scss']
})
export class InvoiceListingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['item', 'date', 'due', 'qty', 'rate', 'tax', 'action'];
  dataSource = new MatTableDataSource<Invoice>();
  resultsLength = 0;
  isResultsLoading = false;

  constructor(private invoiceService: InvoiceService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        merge(this.sort.sortChange),
        startWith({}),
        switchMap(() => {
          this.isResultsLoading = true;
          return this.invoiceService.getInvoices({
            page: this.paginator.pageIndex,
            perPage: this.paginator.pageSize,
            sortField: this.sort.active,
            sortDir: this.sort.direction,
            filter: ''
          });
        }),
        map(data => {
          this.isResultsLoading = false;
          this.resultsLength = data.total;
          return data.docs;
        }),
        catchError(() => {
          this.isResultsLoading = false;
          this.errorHandler('Failed to fetch invoices', 'Error');
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
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
        const removedItems = remove(this.dataSource.data, item => {
          return item._id === data._id;
        });
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open('Invoice deleted', 'Success', {
          duration: 3000
        });
      },
      err => this.errorHandler(err, 'Failed to delete invoice')
    );
  }

  filterText(filterValue: string) {
    this.isResultsLoading = true;
    filterValue = filterValue.trim();
    this.paginator.pageIndex = 0;
    this.invoiceService
      .getInvoices({
        page: this.paginator.pageIndex,
        perPage: this.paginator.pageSize,
        sortField: this.sort.active,
        sortDir: this.sort.direction,
        filter: filterValue
      })
      .subscribe(
        data => {
          this.isResultsLoading = false;
          this.dataSource.data = data.docs;
          this.resultsLength = data.total;
        },
        err => this.errorHandler('Failed to filter invoices', err)
      );
  }

  private populateInvoices() {
    this.isResultsLoading = true;
    this.invoiceService
      .getInvoices({
        page: this.paginator.pageIndex,
        perPage: this.paginator.pageSize,
        sortField: this.sort.active,
        sortDir: this.sort.direction,
        filter: ''
      })
      .subscribe(
        data => {
          // this.dataSource = data.docs;
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
