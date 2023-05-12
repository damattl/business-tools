import { JsonObject, JsonProperty, PropertyConvertingMode } from "json2typescript"

@JsonObject("Model")
export class Model {
  @JsonProperty("ID", Number, PropertyConvertingMode.IGNORE_NULLABLE)
  id: number | null
  @JsonProperty("CreatedAt", String, PropertyConvertingMode.IGNORE_NULLABLE)
  createdAt: string | null
  @JsonProperty("UpdatedAt", String, PropertyConvertingMode.IGNORE_NULLABLE)
  updatedAt: string | null
  @JsonProperty("DeletedAt", String, PropertyConvertingMode.IGNORE_NULLABLE)
  deletedAt: string | null
}
