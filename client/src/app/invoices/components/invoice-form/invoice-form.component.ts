import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { InvoiceService } from '../../services/invoice.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.invoiceForm = this.fb.group({
      item: ['', Validators.required],
      date: ['', Validators.required],
      due: ['', Validators.required],
      qty: ['', Validators.required],
      rate: '',
      tax: ''
    });
  }

  onSubmit() {
    this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(
      data => {
        this.snackBar.open('Invoice Created', 'Success', {
          duration: 3000
        });
        this.invoiceForm.reset();
        this.router.navigate(['dashboard','invoices']);
      },
      err => this.errorHandler(err,'Failed to create Invoice')
    );
  }

  private errorHandler (error, message){
    console.error(error);
    this.snackBar.open(message, 'Error',{
      duration: 3000
    })
  }
}
