package routes

import (
	"api/models"
	"context"
	"gorm.io/gorm"
	"net/http"
)

func GetProducts(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetAll[models.Product](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func GetProduct(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	GetOneWithID[models.Product](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func AddProduct(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	AddOne[models.Product](w, r, appCtx, func(db *gorm.DB) *gorm.DB {
		return db
	})
}

func UpdateProduct(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	UpdateOne[models.Product](w, r, appCtx)
}

func DeleteProduct(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	DeleteOne[models.Product](w, r, appCtx)
}
