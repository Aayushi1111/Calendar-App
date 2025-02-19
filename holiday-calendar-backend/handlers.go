package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var holidayCollection = GetCollection("holidays")

// Add Holiday
func AddHoliday(w http.ResponseWriter, r *http.Request) {
	var holiday Holiday
	json.NewDecoder(r.Body).Decode(&holiday)

	holiday.ID = primitive.NewObjectID()
	_, err := holidayCollection.InsertOne(context.TODO(), holiday)
	if err != nil {
		http.Error(w, "Failed to add holiday", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(holiday)
}

// Get All Holidays
func GetHolidays(w http.ResponseWriter, r *http.Request) {
	cursor, err := holidayCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch holidays", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var holidays []Holiday
	for cursor.Next(context.TODO()) {
		var holiday Holiday
		cursor.Decode(&holiday)
		holidays = append(holidays, holiday)
	}

	json.NewEncoder(w).Encode(holidays)
}

// Delete Holiday
func DeleteHoliday(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	id, _ := primitive.ObjectIDFromHex(params.Get("id"))

	_, err := holidayCollection.DeleteOne(context.TODO(), bson.M{"_id": id})
	if err != nil {
		http.Error(w, "Failed to delete holiday", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	fmt.Fprint(w, "Holiday deleted successfully")
}
