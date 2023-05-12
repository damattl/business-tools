package routes

import (
	"api/models"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func collectId(w http.ResponseWriter, r *http.Request) (string, bool) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintln(w, "Missing id parameter")
	}
	return id, ok
}

func collectBody[T models.Model](w http.ResponseWriter, r *http.Request) (*T, bool) {
	decoder := json.NewDecoder(r.Body)
	var entity T
	err := decoder.Decode(&entity)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println(err.Error())
		return nil, false
	}
	return &entity, true
}

func raiseNotFoundError(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintln(w, "Could not find an entry matching your description")
}

func raiseDbConnectionError(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	log.Println("Could not get Database Connection from Application Context")
}

func raiseDbError(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	log.Println(err.Error())
}

func raiseJsonError(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	log.Println(err.Error())
}
