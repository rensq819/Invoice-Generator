import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { InvoiceService } from "../../services/invoice.service";
import { MatSnackBar } from "@angular/material";
import { Invoice } from "../../models/invoice";

@Component({
  selector: "app-invoice-form",
  templateUrl: "./invoice-form.component.html",
  styleUrls: ["./invoice-form.component.scss"]
})
export class InvoiceFormComponent implements OnInit {
  private invoice: Invoice;
  invoiceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    this.setInvoiceToForm();
  }

  createForm() {
    this.invoiceForm = this.fb.group({
      item: ["", Validators.required],
      date: ["", Validators.required],
      due: ["", Validators.required],
      qty: ["", Validators.required],
      rate: "",
      tax: ""
    });
  }

  setInvoiceToForm() {
    // use activated route
    this.route.params.subscribe(params => {
      let id = params["id"];
      if (!id) {
        return;
      }
      this.invoiceService.getInvoiceById(id).subscribe(
        invoice => {
          this.invoice = invoice;
          // use formGroup patchValue to set values
          this.invoiceForm.patchValue(this.invoice);
        },
        err => this.errorHandler(err, "Failed to get Invoice")
      );
    });
  }

  onSubmit() {
    // user wants to edit an existing invoice
    if (this.invoice) {
      this.invoiceService
        .updateInvoiceById(this.invoice._id, this.invoiceForm.value)
        .subscribe(
          data => {
            this.snackBar.open(" Invoice update", "Success", {
              duration: 3000
            });
            this.invoiceForm.reset();
            this.router.navigate(["dashboard", "invoices"]);
          },
          err => this.errorHandler(err, "Failed to update invoice")
        );
    }
    // user wants to create new invoice
    else {
      this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(
        data => {
          this.snackBar.open("Invoice Created", "Success", {
            duration: 3000
          });
          this.invoiceForm.reset();
          this.router.navigate(["dashboard", "invoices"]);
        },
        err => this.errorHandler(err, "Failed to create Invoice")
      );
    }
  }

  private errorHandler(error, message) {
    console.error(error);
    this.snackBar.open(message, "Error", {
      duration: 3000
    });
  }
}
