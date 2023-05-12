package server

import (
	"context"
	"log"
	"net/http"
)

func Start(ctx context.Context) {
	r := setupRouting(ctx)

	http.Handle("/", r)

	server := &http.Server{
		Handler: r,
		Addr:    "localhost:4321",
	}
	log.Fatal(server.ListenAndServe())
}
