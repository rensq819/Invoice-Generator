import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Invoice, InvoicePaginationRsp } from "../models/invoice";

const BASE_URL = "http://localhost:3000/api";

@Injectable({
  providedIn: "root"
})
export class InvoiceService {
  constructor(private httpClient: HttpClient) {}

  getInvoices({page, perPage}): Observable<InvoicePaginationRsp> {
    return this.httpClient.get<InvoicePaginationRsp>(`${BASE_URL}/invoices?page=${page}&perPage=${perPage}`);
  }

  createInvoice(body: Invoice): Observable<Invoice> {
    return this.httpClient.post<Invoice>(`${BASE_URL}/invoices`, body);
  }

  deleteInvoice(id: string): Observable<Invoice> {
    return this.httpClient.delete<Invoice>(`${BASE_URL}/invoices/${id}`);
  }

  getInvoiceById(id: string): Observable<Invoice>{
    return this.httpClient.get<Invoice>(`${BASE_URL}/invoices/${id}`)
  }

  updateInvoiceById(id: string, body: Invoice): Observable<Invoice>{
    return this.httpClient.put<Invoice>(`${BASE_URL}/invoices/${id}`, body)
  }
}
