from pydantic import BaseModel


class InvoiceItem(BaseModel):
    productName: str
    amount: int
    price: float
    total: float
