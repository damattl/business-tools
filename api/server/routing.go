package server

import (
	"api/server/routes"
	"context"
	"github.com/gorilla/mux"
)

func setupRouting(ctx context.Context) *mux.Router {
	r := mux.NewRouter()

	api := r.PathPrefix("/api/v1").Subrouter()

	r.HandleFunc("/", routes.Home)
	api.HandleFunc("/products", withDefaultMiddleWare(routes.GetProducts, ctx)).Methods("GET")
	api.HandleFunc("/products/{id:[0-9]+}", withDefaultMiddleWare(routes.GetProduct, ctx)).Methods("GET")
	api.HandleFunc("/products", withDefaultMiddleWare(routes.AddProduct, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/products/{id:[0-9]+}", withDefaultMiddleWare(routes.UpdateProduct, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/products/{id:[0-9]+}", withDefaultMiddleWare(routes.DeleteProduct, ctx)).Methods("DELETE", "OPTIONS")

	api.HandleFunc("/invoices", withDefaultMiddleWare(routes.GetInvoices, ctx)).Methods("GET")
	api.HandleFunc("/invoices/{id:[0-9]+}", withDefaultMiddleWare(routes.GetInvoice, ctx)).Methods("GET")
	api.HandleFunc("/invoices", withDefaultMiddleWare(routes.AddInvoice, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/invoices/{id:[0-9]+}", withDefaultMiddleWare(routes.UpdateInvoice, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/invoices/{id:[0-9]+}", withDefaultMiddleWare(routes.DeleteInvoice, ctx)).Methods("DELETE", "OPTIONS")

	api.HandleFunc("/invoice_items", withDefaultMiddleWare(routes.GetInvoiceItems, ctx)).Methods("GET")
	api.HandleFunc("/invoice_items/{id:[0-9]+}", withDefaultMiddleWare(routes.GetInvoiceItem, ctx)).Methods("GET")
	api.HandleFunc("/invoice_items", withDefaultMiddleWare(routes.AddInvoiceItem, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/invoice_items/{id:[0-9]+}", withDefaultMiddleWare(routes.UpdateInvoiceItem, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/invoice_items/{id:[0-9]+}", withDefaultMiddleWare(routes.DeleteInvoiceItem, ctx)).Methods("DELETE", "OPTIONS")

	api.HandleFunc("/customers", withDefaultMiddleWare(routes.GetCustomers, ctx)).Methods("GET")
	api.HandleFunc("/customers/{id:[0-9]+}", withDefaultMiddleWare(routes.GetCustomer, ctx)).Methods("GET")
	api.HandleFunc("/customers", withDefaultMiddleWare(routes.AddCustomer, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/customers/{id:[0-9]+}", withDefaultMiddleWare(routes.UpdateCustomer, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/customers/{id:[0-9]+}", withDefaultMiddleWare(routes.DeleteCustomer, ctx)).Methods("DELETE", "OPTIONS")

	api.HandleFunc("/service_records", withDefaultMiddleWare(routes.GetServiceRecords, ctx)).Methods("GET")
	api.HandleFunc("/service_records/{id:[0-9]+}", withDefaultMiddleWare(routes.GetServiceRecord, ctx)).Methods("GET")
	api.HandleFunc("/service_records", withDefaultMiddleWare(routes.AddServiceRecord, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/service_records/{id:[0-9]+}", withDefaultMiddleWare(routes.UpdateServiceRecord, ctx)).Methods("POST", "OPTIONS")
	api.HandleFunc("/service_records/{id:[0-9]+}", withDefaultMiddleWare(routes.DeleteServiceRecord, ctx)).Methods("DELETE", "OPTIONS")

	return r
}
