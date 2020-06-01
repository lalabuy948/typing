package main

import (
	"backend/src"
	"log"
	"os"
)

func main() {
	f, err := os.OpenFile("server-error.log",
		os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)

	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	logger := log.New(f, "prefix", log.LstdFlags)

	quotes, err := src.ParseJsonQuotes()
	if err != nil {
		logger.Println(err)
	}

	server := src.NewServer(&quotes, logger)

	server.Run(src.GetEnv("PORT", "8080"))
}
