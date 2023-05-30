package models

import (
	"gorm.io/gorm"
	"time"
)

type InvoiceStatus = string

const (
	statusOpen    InvoiceStatus = "OPEN"
	statusPending InvoiceStatus = "PENDING"
	statusClosed  InvoiceStatus = "CLOSED"
)

type Invoice struct {
	gorm.Model
	Date         time.Time
	InvoiceItems []InvoiceItem `json:",omitempty"`
	Status       InvoiceStatus `gorm:"default:'OPEN'"`
	CustomerID   uint
	Customer     *Customer `json:",omitempty"`
}
