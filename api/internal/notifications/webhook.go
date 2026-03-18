package notifications

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"patrickfanella.co/api/internal/models"
)

type WebhookNotifier struct {
	webhookURL  string
	bearerToken string
	client      *http.Client
}

type contactNotificationPayload struct {
	Event          string    `json:"event"`
	ContactID      int64     `json:"contactId"`
	CreatedAt      time.Time `json:"createdAt"`
	Name           string    `json:"name"`
	Email          string    `json:"email"`
	MessagePreview string    `json:"messagePreview"`
	MessageLength  int       `json:"messageLength"`
	HasFullMessage bool      `json:"hasFullMessageInDatabase"`
	Source         string    `json:"source"`
}

func NewWebhookNotifier(webhookURL, bearerToken string, timeout time.Duration) *WebhookNotifier {
	if timeout <= 0 {
		timeout = 5 * time.Second
	}

	return &WebhookNotifier{
		webhookURL:  strings.TrimSpace(webhookURL),
		bearerToken: strings.TrimSpace(bearerToken),
		client: &http.Client{
			Timeout: timeout,
		},
	}
}

func (n *WebhookNotifier) Enabled() bool {
	return n != nil && n.webhookURL != ""
}

func (n *WebhookNotifier) NotifyContact(ctx context.Context, message models.ContactMessage) error {
	if !n.Enabled() {
		return nil
	}

	payload := contactNotificationPayload{
		Event:          "contact.submitted",
		ContactID:      message.ID,
		CreatedAt:      message.CreatedAt.UTC(),
		Name:           message.Name,
		Email:          message.Email,
		MessagePreview: preview(message.Message, 240),
		MessageLength:  len(message.Message),
		HasFullMessage: true,
		Source:         "patrickfanella-co",
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal notification payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, n.webhookURL, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build webhook request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	if n.bearerToken != "" {
		req.Header.Set("Authorization", "Bearer "+n.bearerToken)
	}

	resp, err := n.client.Do(req)
	if err != nil {
		return fmt.Errorf("send webhook request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		responseBody, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return fmt.Errorf("webhook returned status %d: %s", resp.StatusCode, strings.TrimSpace(string(responseBody)))
	}

	return nil
}

func preview(message string, limit int) string {
	message = strings.Join(strings.Fields(strings.TrimSpace(message)), " ")
	if limit <= 0 || len(message) <= limit {
		return message
	}

	if limit <= 1 {
		return "…"
	}

	return strings.TrimSpace(message[:limit-1]) + "…"
}
