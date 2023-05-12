package routes

import (
	"api/models"
	"context"
	"gorm.io/gorm"
	"net/http"
)

func GetServiceRecords(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetAll[models.ServiceRecord](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func GetServiceRecord(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetOneWithID[models.ServiceRecord](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db.Preload("Product").Preload("Customer")
	})
}

func AddServiceRecord(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	AddOne[models.ServiceRecord](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func UpdateServiceRecord(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	UpdateOne[models.ServiceRecord](w, r, appCtx)
}

func DeleteServiceRecord(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	DeleteOne[models.ServiceRecord](w, r, appCtx)
}
