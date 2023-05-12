package routes

import (
	"api/keys"
	"api/models"
	"context"
	"encoding/json"
	"fmt"
	"gorm.io/gorm"
	"log"
	"net/http"
)

type dbModifier = func(db *gorm.DB) *gorm.DB

func GetAll[T models.Model](w http.ResponseWriter, r *http.Request, appCtx context.Context, modify dbModifier) {
	db, ok := appCtx.Value(keys.DbConnection).(*gorm.DB)
	if !ok {
		raiseDbConnectionError(w)
		return
	}

	entities := []*T{}
	if err := (modify(db)).Find(&entities).Error; err != nil {
		raiseDbError(w, err)
		return
	}

	jsonStr, err := json.Marshal(&entities)
	if err != nil {
		raiseJsonError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, string(jsonStr))
}

func GetOneWithID[T models.Model](w http.ResponseWriter, r *http.Request, appCtx context.Context, modify dbModifier) {
	db, ok := appCtx.Value(keys.DbConnection).(*gorm.DB)
	if !ok {
		raiseDbConnectionError(w)
		return
	}

	id, ok := collectId(w, r)
	if !ok {
		return
	}

	var entity T
	if err := (modify(db)).First(&entity, id).Error; err != nil {
		fmt.Println(err)
		raiseNotFoundError(w)
		return
	}

	jsonStr, err := json.Marshal(&entity)
	if err != nil {
		raiseDbError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, string(jsonStr))
}

func AddOne[T models.Model](w http.ResponseWriter, r *http.Request, appCtx context.Context, modify dbModifier) {
	db, ok := appCtx.Value(keys.DbConnection).(*gorm.DB)
	if !ok {
		raiseDbConnectionError(w)
		return
	}

	entity, ok := collectBody[T](w, r)
	if !ok {
		return
	}

	if err := modify(db).Create(entity).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err.Error())
		return
	}

	w.WriteHeader(http.StatusCreated)
	return // TODO: Return ID
}

func UpdateOne[T models.Model](w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	db, ok := appCtx.Value(keys.DbConnection).(*gorm.DB)
	if !ok {
		raiseDbConnectionError(w)
		return
	}

	id, ok := collectId(w, r)
	if !ok {
		return
	}

	update, ok := collectBody[T](w, r)
	if !ok {
		return
	}

	var entity T
	if err := db.First(&entity, id).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err.Error())
		return
	}

	if err := db.Model(&entity).Updates(&update).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
	return
}

func DeleteOne[T models.Model](w http.ResponseWriter, r *http.Request, appCtx context.Context) {
	db, ok := appCtx.Value(keys.DbConnection).(*gorm.DB)
	if !ok {
		raiseDbConnectionError(w)
		return
	}

	id, ok := collectId(w, r)
	if !ok {
		return
	}

	var entity T
	if err := db.Delete(&entity, id).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println(err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
	return
}
