package routes

import (
	"api/models"
	"context"
	"gorm.io/gorm"
	"net/http"
)

func GetCustomers(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetAll[models.Customer](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db.Preload("Invoices")
	})
}

func GetCustomer(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetOneWithID[models.Customer](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db.Preload("Invoices").Preload("Invoices.InvoiceItems").Preload("Invoices.InvoiceItems.Product")
	})
}

func AddCustomer(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	AddOne[models.Customer](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func UpdateCustomer(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	UpdateOne[models.Customer](w, r, appCtx)
}

func DeleteCustomer(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	DeleteOne[models.Customer](w, r, appCtx)
}
