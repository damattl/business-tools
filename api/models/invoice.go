package models

import (
	"gorm.io/gorm"
	"time"
)

type Invoice struct {
	gorm.Model
	Date         time.Time
	InvoiceItems []InvoiceItem `json:",omitempty"`
	CustomerID   uint
	Customer     *Customer `json:",omitempty"`
}
