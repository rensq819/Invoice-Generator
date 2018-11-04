import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceBuilderModule } from './invoice-builder/invoice-builder.module';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'invoice-builder',
    loadChildren: './invoice-builder/invoice-builder.module#InvoiceBuilderModule'
  },
  {
    path: '**',
    redirectTo: 'invoice-builder'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
