package models

import "gorm.io/gorm"

type Address struct {
	Street     string
	StreetNr   string
	PostalCode string
	City       string
	Country    string
}

type Customer struct {
	gorm.Model
	Title *string
	// FormOfAddress *string TODO
	FirstName string
	LastName  string
	Company   *string
	Email     *string
	Phone     *string
	Address   *Address  `gorm:"embedded"`
	Invoices  []Invoice `json:",omitempty"`

	MicrosoftContactId *string
}
