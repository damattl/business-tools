package main

import (
	"api/keys"
	"api/models"
	"api/server"
	"context"
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// @title BusinessTools API
// @version 1.0
// @host localhost:4321
// @BasePath /api/v1

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

	ctx := context.WithValue(context.Background(), keys.DbConnection, db)

	if err != nil {
		panic("failed to connect database")
	}

	err = db.AutoMigrate(
		&models.Product{},
		&models.Customer{},
		&models.Invoice{},
		&models.InvoiceItem{},
		&models.ServiceRecord{},
	)
	if err != nil {
		fmt.Println(err)
	}

	/* db.Create(&models.Product{Name: "Systemadministration", Price: 80})

	 var product models.Product
	db.First(&product, 2)

	fmt.Println(product)

	db.Model(&product).Update("Price", 200)

	var product2 models.Product
	db.First(&product2, 2)

	fmt.Println(product2)

	db.Delete(&product, 2)

	db.Create(&models.Customer{
		FirstName: "Niklas",
		LastName:  "Stein",
		Company:   "stein_it Services & Solutions",
		Address: models.Address{
			City:       "Hamburg",
			PostalCode: "25123",
			Street:     "Teststr.",
			StreetNr:   "123",
			Country:    "DE",
		},
	})

	db.Create(&models.Invoice{
		Date:       time.Now(),
		CustomerID: 1,
	})

	*/

	server.Start(ctx)
}
