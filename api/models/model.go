package models

type Model interface {
	Customer | Invoice | InvoiceItem | Product | ServiceRecord
}
