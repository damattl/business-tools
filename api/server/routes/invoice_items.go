package routes

import (
	"api/models"
	"context"
	"gorm.io/gorm"
	"net/http"
)

func GetInvoiceItems(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetAll[models.InvoiceItem](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func GetInvoiceItem(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetOneWithID[models.InvoiceItem](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db.Preload("Product")
	})
}

func AddInvoiceItem(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	AddOne[models.InvoiceItem](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func UpdateInvoiceItem(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	UpdateOne[models.InvoiceItem](w, r, appCtx)
}

func DeleteInvoiceItem(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	DeleteOne[models.InvoiceItem](w, r, appCtx)
}
