import { JsonObject, JsonProperty, PropertyConvertingMode } from "json2typescript"
import { Model } from "./model"
import { InvoiceItem } from "./invoice-item.model"
import type { Customer } from "./customer.model"

type InvoiceStatus = "OPEN" | "PENDING" | "CLOSED"

@JsonObject("Invoice")
export class Invoice extends Model {
  @JsonProperty("Date", String, PropertyConvertingMode.IGNORE_NULLABLE)
  date: string | null
  @JsonProperty("InvoiceItems", [InvoiceItem], PropertyConvertingMode.IGNORE_NULLABLE)
  invoiceItems: InvoiceItem[] = []
  @JsonProperty("Status", String)
  status: InvoiceStatus
  @JsonProperty("CustomerID", Number)
  customerId: number
  @JsonProperty("Customer", "Customer", PropertyConvertingMode.IGNORE_NULLABLE)
  customer: Customer | null
}
