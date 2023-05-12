package models

import "gorm.io/gorm"

type InvoiceItem struct {
	gorm.Model
	ProductId   uint
	Product     *Product `json:",omitempty"`
	Amount      uint
	CustomPrice *float32
	Description *string
	InvoiceId   uint
}
