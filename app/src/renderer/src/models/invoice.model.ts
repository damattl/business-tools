import { JsonObject, JsonProperty, PropertyConvertingMode } from "json2typescript"
import { Model } from "./model"
import { InvoiceItem } from "./invoice-item.model"
import type { Customer } from "./customer.model"

@JsonObject("Invoice")
export class Invoice extends Model {
  @JsonProperty("Date", String, PropertyConvertingMode.IGNORE_NULLABLE)
  date: string | null
  @JsonProperty("InvoiceItems", [InvoiceItem], PropertyConvertingMode.IGNORE_NULLABLE)
  invoiceItems: InvoiceItem[] = []
  @JsonProperty("CustomerID", Number)
  customerId: number
  @JsonProperty("Customer", "Customer", PropertyConvertingMode.IGNORE_NULLABLE)
  customer: Customer | null
}
