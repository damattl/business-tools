import type { Invoice } from "../models/invoice.model"
import type { InvoiceItem } from "../models/invoice-item.model"

export function calculateTotalForInvoice(invoice: Invoice): number {
  let price = 0
  invoice.invoiceItems.forEach(item => {
    price += calculateTotal(item)
  })
  return price
}

export function calculateTotal(item: InvoiceItem): number {
  let price = 0
  if (item.customPrice > 0) {
    price += item.customPrice * item.amount
  } else {
    price += item.product.price * item.amount
  }
  return price
}

export function calculateInvoiceNumber(invoice: Invoice): string {
  const date = new Date(invoice.date)
  return `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${invoice.id}`
}

export function renderDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('de', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

}
