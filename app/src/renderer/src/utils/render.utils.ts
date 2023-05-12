
import type { InvoiceRenderData } from "../models/invoice.render.interface"
import type { Invoice } from "../models/invoice.model"
import { calculateInvoiceNumber, calculateTotal, calculateTotalForInvoice, renderDate } from "./invoice.utils"

function renderDataFromInvoice(invoice: Invoice): InvoiceRenderData {
  const items: { amount: number; price: number; productName: string; total: number }[] = []
  invoice.invoiceItems.forEach(item =>
    items.push({
      amount: item.amount,
      price: item.customPrice == 0 ? item.product.price : item.customPrice,
      productName: item.product.name,
      total: calculateTotal(item)
    })
  )

  return {
    customer: {
      address: {
        city: invoice.customer.address.city,
        country: invoice.customer.address.country,
        postalCode: invoice.customer.address.postalCode,
        street: invoice.customer.address.street,
        streetNr: invoice.customer.address.streetNr },
      company: invoice.customer.company,
      firstName: invoice.customer.firstName,
      lastName: invoice.customer.lastName
    },
    date: renderDate(invoice.date),
    items: items,
    number: calculateInvoiceNumber(invoice),
    total: calculateTotalForInvoice(invoice)
  }
}

export async function renderInvoice(invoice: Invoice): Promise<Response> {
  const data = renderDataFromInvoice(invoice)

  return await fetch(`http://localhost:8000/render`, {
    method: "POST",
    body: JSON.stringify(data),
    headers:{'content-type': 'application/json'},
  })
}
