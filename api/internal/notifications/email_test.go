package notifications

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"patrickfanella.co/api/internal/models"
)

func TestEmailHasFixedRecipientEscapesContentAndRepliesToSender(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("api-key") != "test-key" {
			t.Error("missing authentication")
		}
		var payload emailPayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			t.Fatal(err)
		}
		if len(payload.To) != 1 || payload.To[0].Email != "patrick@subcult.tv" {
			t.Errorf("unexpected recipients: %v", payload.To)
		}
		if payload.Sender.Email != "alerts@subcult.tv" || payload.ReplyTo.Email != "sender@example.com" {
			t.Error("sender/reply-to mismatch")
		}
		if strings.Contains(payload.Subject, "\n") || strings.Contains(payload.Subject, "\r") {
			t.Error("subject contains a header delimiter")
		}
		if strings.Contains(payload.HTMLContent, "<script>") || !strings.Contains(payload.HTMLContent, "&lt;script&gt;") {
			t.Error("message HTML was not escaped")
		}
		if !strings.Contains(payload.TextContent, "<script>") {
			t.Error("plain-text message was altered")
		}
		if payload.Headers["IdempotencyKey"] != "portfolio-contact-42" {
			t.Error("missing stable contact identity")
		}
		w.WriteHeader(http.StatusCreated)
	}))
	defer server.Close()
	n := &emailNotifier{config: EmailConfig{APIKey: "test-key", From: "alerts@subcult.tv", To: "patrick@subcult.tv"}, endpoint: server.URL, client: server.Client()}
	if err := n.notify(context.Background(), models.ContactMessage{ID: 42, Name: "Sender\r\nName", Email: "Sender <sender@example.com>", Message: "hello <script>alert(1)</script>", CreatedAt: time.Now()}); err != nil {
		t.Fatal(err)
	}
}

func TestEmailFailureDoesNotExposeProviderPayload(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(400)
		_, _ = w.Write([]byte("private contact content test-key"))
	}))
	defer server.Close()
	n := &emailNotifier{config: EmailConfig{APIKey: "test-key", From: "alerts@subcult.tv", To: "patrick@subcult.tv"}, endpoint: server.URL, client: server.Client()}
	err := n.notify(context.Background(), models.ContactMessage{Email: "sender@example.com"})
	if err == nil || err.Error() != "email provider returned status 400" {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestEmailDisabledWithoutKeyAndHonorsCancellation(t *testing.T) {
	if NewMultiNotifier("", "", "", time.Second, EmailConfig{From: "alerts@subcult.tv", To: "patrick@subcult.tv"}).Enabled() {
		t.Fatal("email enabled without a key")
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	n := &emailNotifier{config: EmailConfig{APIKey: "test-key", From: "alerts@subcult.tv", To: "patrick@subcult.tv"}, endpoint: "https://example.invalid", client: &http.Client{Timeout: time.Second}}
	if err := n.notify(ctx, models.ContactMessage{Email: "sender@example.com"}); err == nil {
		t.Fatal("expected cancellation")
	}
}
