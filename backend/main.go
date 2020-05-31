package main

import (
	"backend/src"
	"os"
)

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func main() {
	quotes, _ := src.ParseJsonQuotes()

	server := src.NewServer(&quotes)

	server.Run(getEnv("PORT", "8080"))
}
