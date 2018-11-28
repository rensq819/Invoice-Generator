import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "../../services/invoice.service";
import { Invoice } from "../../models/invoice";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { remove } from "lodash";

@Component({
  selector: "app-invoice-listing",
  templateUrl: "./invoice-listing.component.html",
  styleUrls: ["./invoice-listing.component.scss"]
})
export class InvoiceListingComponent implements OnInit {
  displayedColumns = ["item", "date", "due", "qty", "rate", "tax", "action"];
  dataSource: Invoice[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.invoiceService.getInvoices().subscribe(data => {
      this.dataSource = data;
    }),
      err => this.errorHandler(err, "Failed to fetch invoices");
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

  private errorHandler(error, message) {
    console.error(error);
    this.snackBar.open(message, "Error", {
      duration: 3000
    });
  }
}
