package routes

import (
	"api/models"
	"context"
	"gorm.io/gorm"
	"net/http"
)

func GetInvoices(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetAll[models.Invoice](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db.Preload("InvoiceItems").Preload("InvoiceItems.Product")
	})
}

func GetInvoice(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetOneWithID[models.Invoice](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db.Preload("Customer").Preload("InvoiceItems").Preload("InvoiceItems.Product")
	})
}

func AddInvoice(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	AddOne[models.Invoice](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func UpdateInvoice(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	UpdateOne[models.Invoice](w, r, appCtx)
}

func DeleteInvoice(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	DeleteOne[models.Invoice](w, r, appCtx)
}
