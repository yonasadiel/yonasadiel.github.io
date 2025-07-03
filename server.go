package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api/electric-state/session/wasteland-justice", func(w http.ResponseWriter, r *http.Request) {
		// Read the JSON file
		data, err := ioutil.ReadFile("data/hecate-notes/wasteland-justice.json")
		if err != nil {
			log.Printf("Error reading file: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		fmt.Printf("Receive request in %s\n", r.URL.String())

		// Verify it's valid JSON
		var jsonData interface{}
		if err := json.Unmarshal(data, &jsonData); err != nil {
			log.Printf("Error parsing JSON: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Set content type
		w.Header().Set("Content-Type", "application/json")

		// Write the JSON response
		w.Write(data)
	})

	fmt.Println("Server starting on :8003...")
	log.Fatal(http.ListenAndServe(":8003", nil))
}
