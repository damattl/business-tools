package server

import (
	"context"
	"net/http"
)

type handlerWithAppContext = func(http.ResponseWriter, *http.Request, context.Context)

func withAppContext(next handlerWithAppContext, appCtx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		next(w, r, appCtx)
	}
}

func withCors(next handlerWithAppContext) handlerWithAppContext {
	return func(w http.ResponseWriter, r *http.Request, appCtx context.Context) {
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
			return
		}

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")

		next(w, r, appCtx)
	}
}

func withDefaultMiddleWare(next handlerWithAppContext, appCtx context.Context) http.HandlerFunc {
	return withAppContext(withCors(next), appCtx)
}
