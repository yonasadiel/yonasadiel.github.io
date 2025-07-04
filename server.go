package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"os"
)

var users = map[string]string{
	"DM":    "517416e4cfe4cea381f38f56d53461898a98149df36da046cfc08a1b6802026c",
	"Ash":   "d2af6073c362add97419c7265d15eac0436adac0905300b4cbaec1d84c834ebb",
	"Chris": "971b1c3a4b0be4b0caadd9027f7f77c595dcc377c8d4b2c893af63895e678b60",
	"Rue":   "5e67c3126e066d29364197668555a14093bf37c9a901dc0fa38e1ffb36c9cd1c",
}

func main() {
	http.HandleFunc("/api/electric-state/session/wasteland-justice", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		name := query.Get("name")
		token := query.Get("token")
		fmt.Printf("Receive request in %s\n", r.URL.String())
		if hashed, ok := users[name]; !ok || hashed != hash(token) {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		// Read the JSON file
		data, err := os.ReadFile("data/hecate-notes/wasteland-justice.json")
		if err != nil {
			log.Printf("Error reading file: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Access-Control-Allow-Origin", "https://yonasadiel.com")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
	})

	fmt.Println("Server starting on :8003...")
	log.Fatal(http.ListenAndServe(":8003", nil))
}

func hash(s string) string {
	h := sha256.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}
