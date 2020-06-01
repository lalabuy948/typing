package src

import "os"

func GetEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func IsDev() bool {
	if GetEnv("ENV", "DEV") != "DEV" {
		return false
	}

	return true
}
