package main

import (
	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/holidays", AddHoliday).Methods("POST")
	router.HandleFunc("/api/holidays", GetHolidays).Methods("GET")
	router.HandleFunc("/api/holidays", DeleteHoliday).Methods("DELETE")

	return router
}
