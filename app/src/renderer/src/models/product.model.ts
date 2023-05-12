import { JsonObject, JsonProperty, PropertyConvertingMode } from "json2typescript"
import { Model } from "./model"

@JsonObject("Product")
export class Product extends Model {
  @JsonProperty("Description", String, PropertyConvertingMode.IGNORE_NULLABLE)
  description: string | null
  @JsonProperty("Name", String, PropertyConvertingMode.IGNORE_NULLABLE)
  name: string | null
  @JsonProperty("Price", Number)
  price: number
}
