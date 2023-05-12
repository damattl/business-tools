import { JsonObject, JsonProperty, PropertyConvertingMode } from "json2typescript"
import { Model } from "./model"
import { Product } from "./product.model"



@JsonObject("InvoiceItem")
export class InvoiceItem extends Model {
  @JsonProperty("ProductId", Number)
  productId: number
  @JsonProperty("Product", Product, PropertyConvertingMode.IGNORE_NULLABLE)
  product: Product | null
  @JsonProperty("Amount", Number)
  amount: number
  @JsonProperty("CustomPrice", Number, PropertyConvertingMode.IGNORE_NULLABLE)
  customPrice: number | null
  @JsonProperty("Description", String, PropertyConvertingMode.IGNORE_NULLABLE)
  description: string | null
  @JsonProperty("InvoiceId", Number)
  invoiceId: number
}
