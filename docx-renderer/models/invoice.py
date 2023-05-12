from pydantic import BaseModel
from models.customer import Customer
from models.invoice_item import InvoiceItem


class Invoice(BaseModel):
    number: str
    date: str
    customer: Customer
    total: float
    items: list[InvoiceItem]
