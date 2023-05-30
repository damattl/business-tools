export interface InvoiceRenderData {
  number: string,
  date: string,
  total: number,
  customer: {
    title: string | null,
    firstName: string,
    lastName: string,
    company: string,
    address: {
      street: string,
      streetNr: string,
      postalCode: string,
      city: string,
      country: string,
    }
  },
  items: {
    productName: string,
    amount: number,
    price: number,
    total: number
  }[]
}
