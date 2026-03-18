package config

import (
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                    string
	DatabaseURL             string
	CORSOrigin              string
	ContactMaxBodyBytes     int64
	ContactRateLimitMax     int
	ContactRateLimitWindow  time.Duration
	ContactHoneypotField    string
}

func Load() Config {
	_ = godotenv.Load("../.env", ".env")

	return Config{
		Port:                   getEnv("API_PORT", "8080"),
		DatabaseURL:            os.Getenv("DATABASE_URL"),
		CORSOrigin:             getEnv("CORS_ORIGIN", "http://localhost:5173"),
		ContactMaxBodyBytes:    getEnvInt64("CONTACT_MAX_BODY_BYTES", 16*1024),
		ContactRateLimitMax:    getEnvInt("CONTACT_RATE_LIMIT_MAX_REQUESTS", 5),
		ContactRateLimitWindow: getEnvSeconds("CONTACT_RATE_LIMIT_WINDOW_SECONDS", 60*time.Second),
		ContactHoneypotField:   getEnv("CONTACT_HONEYPOT_FIELD", "website"),
	}
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

func getEnvInt(key string, fallback int) int {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil || parsed <= 0 {
		return fallback
	}

	return parsed
}

func getEnvInt64(key string, fallback int64) int64 {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.ParseInt(value, 10, 64)
	if err != nil || parsed <= 0 {
		return fallback
	}

	return parsed
}

func getEnvSeconds(key string, fallback time.Duration) time.Duration {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil || parsed <= 0 {
		return fallback
	}

	return time.Duration(parsed) * time.Second
}
