import { Component, OnInit, ViewChild } from "@angular/core";
import { InvoiceService } from "../../services/invoice.service";
import { Invoice } from "../../models/invoice";
import { Router } from "@angular/router";
import { MatSnackBar, MatPaginator } from "@angular/material";
import { remove } from "lodash";

@Component({
  selector: "app-invoice-listing",
  templateUrl: "./invoice-listing.component.html",
  styleUrls: ["./invoice-listing.component.scss"]
})
export class InvoiceListingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ["item", "date", "due", "qty", "rate", "tax", "action"];
  dataSource: Invoice[] = [];
  resultsLength = 0;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.paginator.page.subscribe(
      data => {
        this.invoiceService
          .getInvoices({
            page: ++data.pageIndex,
            perPage: data.pageSize
          })
          .subscribe(data => {
            console.log(data);
            this.dataSource = data.docs;
            this.resultsLength = data.total;
          });
      },
      err => this.errorHandler(err, "Failed to delete invoice")
    );
    this.populateInvoices();
  }

  createBtnHandler() {
    this.router.navigate(["dashboard", "invoices", "new"]);
  }

  editBtnHandler(id) {
    this.router.navigate(["dashboard", "invoices", id]);
  }

  deleteBtnHandler(id) {
    this.invoiceService.deleteInvoice(id).subscribe(
      data => {
        const removedItems = remove(this.dataSource, item => {
          return item._id === data._id;
        });
        this.dataSource = [...this.dataSource];
        this.snackBar.open("Invoice deleted", "Success", {
          duration: 3000
        });
      },
      err => this.errorHandler(err, "Failed to delete invoice")
    );
  }

  private populateInvoices() {
    this.invoiceService
      .getInvoices({ page: 1, perPage: 10 })
      .subscribe(data => {
        this.dataSource = data.docs;
        this.resultsLength = data.total;
      }),
      err => this.errorHandler(err, "Failed to fetch invoices");
  }
  private errorHandler(error, message) {
    console.error(error);
    this.snackBar.open(message, "Error", {
      duration: 3000
    });
  }
}
