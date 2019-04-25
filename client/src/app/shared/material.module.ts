import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatCardModule,
  MatTableModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatDialogModule
} from '@angular/material';

const exportedMatModules = [
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatCardModule,
  MatTableModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatDialogModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...exportedMatModules],
  exports: [...exportedMatModules]
})
export class MaterialModule {}
