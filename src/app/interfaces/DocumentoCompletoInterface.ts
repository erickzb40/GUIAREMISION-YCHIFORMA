import { CustomerInterface } from "./CustomerInterface";
import { InvoiceDetalleInterface } from "./InvoiceDetalleInterface";
import { TicketInterface } from "./TicketInterface";

export interface DocumentoCompletoInterface{
  number?: number,
  ticketnum?: number,
  ticket?: TicketInterface,
  idate?: string,
  customernumber?: string,
  customer?: CustomerInterface,
  customername?: string,
  total?: string,
  currencY_ID?: string,
  terms?: string,
  invoiceDetalle?: InvoiceDetalleInterface[]
}

