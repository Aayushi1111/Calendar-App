package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	ConnectDB()
	router := SetupRoutes()

	port := os.Getenv("PORT")
	fmt.Println("🚀 Server running on port:", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
