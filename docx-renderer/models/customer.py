from pydantic import BaseModel


class Address(BaseModel):
    street: str
    streetNr: str
    postalCode: str
    city: str
    country: str


class Customer(BaseModel):
    title: str | None = None
    firstName: str
    lastName: str
    company: str
    address: Address
