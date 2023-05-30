import { JsonObject, JsonProperty, PropertyConvertingMode } from "json2typescript"
import { Model } from "./model"
import { Invoice } from "./invoice.model"

@JsonObject("Address")
export class Address extends Model {
  @JsonProperty("Street", String)
  street: string
  @JsonProperty("StreetNr", String)
  streetNr: string
  @JsonProperty("PostalCode", String)
  postalCode: string
  @JsonProperty("City", String)
  city: string
  @JsonProperty("Country", String, PropertyConvertingMode.IGNORE_NULLABLE)
  country: string | null
}

@JsonObject("Customer")
export class Customer extends Model {
  @JsonProperty("MicrosoftContactId", String, PropertyConvertingMode.IGNORE_NULLABLE)
  microsoftContactId: string | null
  @JsonProperty("Title", String, PropertyConvertingMode.IGNORE_NULLABLE)
  title: string | null
  @JsonProperty("FirstName", String)
  firstName: string
  @JsonProperty("LastName", String)
  lastName: string
  @JsonProperty("Company", String, PropertyConvertingMode.IGNORE_NULLABLE)
  company: string | null
  @JsonProperty("Email", String, PropertyConvertingMode.IGNORE_NULLABLE)
  mail: string | null
  @JsonProperty("Phone", String, PropertyConvertingMode.IGNORE_NULLABLE)
  phone: string | null
  @JsonProperty("Address", Address)
  address: Address
  @JsonProperty("Invoices", [Invoice], PropertyConvertingMode.IGNORE_NULLABLE)
  invoices: Invoice[] = []
}
