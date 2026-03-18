package handlers

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

type ContactSecurityConfig struct {
	AllowedOrigin        string
	HoneypotField        string
	MaxBodyBytes         int64
	RateLimitMaxRequests int
	RateLimitWindow      time.Duration
}

func defaultContactSecurityConfig() ContactSecurityConfig {
	return ContactSecurityConfig{
		HoneypotField:        "website",
		MaxBodyBytes:         16 * 1024,
		RateLimitMaxRequests: 5,
		RateLimitWindow:      time.Minute,
	}
}

func (cfg ContactSecurityConfig) withDefaults() ContactSecurityConfig {
	defaults := defaultContactSecurityConfig()

	if strings.TrimSpace(cfg.AllowedOrigin) != "" {
		defaults.AllowedOrigin = strings.TrimSpace(cfg.AllowedOrigin)
	}

	if strings.TrimSpace(cfg.HoneypotField) != "" {
		defaults.HoneypotField = strings.TrimSpace(cfg.HoneypotField)
	}

	if cfg.MaxBodyBytes > 0 {
		defaults.MaxBodyBytes = cfg.MaxBodyBytes
	}

	if cfg.RateLimitMaxRequests > 0 {
		defaults.RateLimitMaxRequests = cfg.RateLimitMaxRequests
	}

	if cfg.RateLimitWindow > 0 {
		defaults.RateLimitWindow = cfg.RateLimitWindow
	}

	return defaults
}

type contactLimiterEntry struct {
	count   int
	resetAt time.Time
}

type contactRateLimiter struct {
	mu          sync.Mutex
	attempts    map[string]contactLimiterEntry
	maxRequests int
	window      time.Duration
}

func newContactRateLimiter(maxRequests int, window time.Duration) *contactRateLimiter {
	config := defaultContactSecurityConfig()
	if maxRequests <= 0 {
		maxRequests = config.RateLimitMaxRequests
	}
	if window <= 0 {
		window = config.RateLimitWindow
	}

	return &contactRateLimiter{
		attempts:    make(map[string]contactLimiterEntry),
		maxRequests: maxRequests,
		window:      window,
	}
}

func (l *contactRateLimiter) Allow(key string) bool {
	if key == "" {
		key = "unknown"
	}

	now := time.Now()

	l.mu.Lock()
	defer l.mu.Unlock()

	for clientKey, entry := range l.attempts {
		if now.After(entry.resetAt) {
			delete(l.attempts, clientKey)
		}
	}

	entry, exists := l.attempts[key]
	if !exists || now.After(entry.resetAt) {
		l.attempts[key] = contactLimiterEntry{count: 1, resetAt: now.Add(l.window)}
		return true
	}

	if entry.count >= l.maxRequests {
		return false
	}

	entry.count++
	l.attempts[key] = entry
	return true
}

func sameOrigin(origin string, allowedOrigin string) bool {
	trimmedOrigin := strings.TrimRight(strings.TrimSpace(origin), "/")
	trimmedAllowedOrigin := strings.TrimRight(strings.TrimSpace(allowedOrigin), "/")

	if trimmedOrigin == "" || trimmedAllowedOrigin == "" {
		return false
	}

	return strings.EqualFold(trimmedOrigin, trimmedAllowedOrigin)
}

func clientIPFromRequest(r *http.Request) string {
	remoteAddr := strings.TrimSpace(r.RemoteAddr)
	if remoteAddr == "" {
		return "unknown"
	}

	host, _, err := net.SplitHostPort(remoteAddr)
	if err == nil && host != "" {
		return host
	}

	return remoteAddr
}