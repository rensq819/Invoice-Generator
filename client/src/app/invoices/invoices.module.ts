import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListingComponent } from './components/invoice-listing/invoice-listing.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InvoiceListingComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [InvoiceListingComponent]
})
export class InvoicesModule {}
