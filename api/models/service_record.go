package models

import (
	"gorm.io/gorm"
	"time"
)

type ServiceRecord struct {
	gorm.Model
	Description *string
	StartTime   time.Time
	EndTime     time.Time

	CustomerId uint
	Customer   *Customer `json:",omitempty"`

	ProductId uint
	Product   *Product `json:",omitempty"`
}
