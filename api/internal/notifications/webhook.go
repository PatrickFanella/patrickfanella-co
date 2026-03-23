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

// ntfyNotifier sends push notifications via ntfy.sh (plain text body with headers).
type ntfyNotifier struct {
	url    string
	token  string
	client *http.Client
}

// n8nNotifier sends structured JSON to an n8n webhook trigger.
type n8nNotifier struct {
	url    string
	client *http.Client
}

// MultiNotifier fans out to all configured notifiers.
type MultiNotifier struct {
	notifiers []singleNotifier
}

type singleNotifier interface {
	notify(ctx context.Context, message models.ContactMessage) error
	enabled() bool
	name() string
}

type n8nPayload struct {
	Event         string    `json:"event"`
	ContactID     int64     `json:"contactId"`
	CreatedAt     time.Time `json:"createdAt"`
	Name          string    `json:"name"`
	Email         string    `json:"email"`
	Message       string    `json:"message"`
	MessageLength int       `json:"messageLength"`
	Source        string    `json:"source"`
}

// NewMultiNotifier creates a notifier that sends to all configured targets.
func NewMultiNotifier(ntfyURL, ntfyToken, n8nURL string, timeout time.Duration) *MultiNotifier {
	if timeout <= 0 {
		timeout = 5 * time.Second
	}

	var notifiers []singleNotifier

	if u := strings.TrimSpace(ntfyURL); u != "" {
		notifiers = append(notifiers, &ntfyNotifier{
			url:    u,
			token:  strings.TrimSpace(ntfyToken),
			client: &http.Client{Timeout: timeout},
		})
	}

	if u := strings.TrimSpace(n8nURL); u != "" {
		notifiers = append(notifiers, &n8nNotifier{
			url:    u,
			client: &http.Client{Timeout: timeout},
		})
	}

	return &MultiNotifier{notifiers: notifiers}
}

func (m *MultiNotifier) Enabled() bool {
	return m != nil && len(m.notifiers) > 0
}

func (m *MultiNotifier) NotifyContact(ctx context.Context, message models.ContactMessage) error {
	if !m.Enabled() {
		return nil
	}

	var errs []string
	for _, n := range m.notifiers {
		if n.enabled() {
			if err := n.notify(ctx, message); err != nil {
				errs = append(errs, fmt.Sprintf("%s: %v", n.name(), err))
			}
		}
	}

	if len(errs) > 0 {
		return fmt.Errorf("%s", strings.Join(errs, "; "))
	}
	return nil
}

// ntfy implementation

func (n *ntfyNotifier) enabled() bool { return n.url != "" }
func (n *ntfyNotifier) name() string  { return "ntfy" }

func (n *ntfyNotifier) notify(ctx context.Context, message models.ContactMessage) error {
	title := fmt.Sprintf("Contact from %s", message.Name)
	body := fmt.Sprintf("%s\n\n%s", message.Email, preview(message.Message, 240))

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, n.url, strings.NewReader(body))
	if err != nil {
		return fmt.Errorf("build request: %w", err)
	}

	req.Header.Set("Title", title)
	req.Header.Set("Priority", "high")
	req.Header.Set("Tags", "envelope")
	if n.token != "" {
		req.Header.Set("Authorization", "Bearer "+n.token)
	}

	return doRequest(n.client, req)
}

// n8n implementation

func (n *n8nNotifier) enabled() bool { return n.url != "" }
func (n *n8nNotifier) name() string  { return "n8n" }

func (n *n8nNotifier) notify(ctx context.Context, message models.ContactMessage) error {
	payload := n8nPayload{
		Event:         "contact.submitted",
		ContactID:     message.ID,
		CreatedAt:     message.CreatedAt.UTC(),
		Name:          message.Name,
		Email:         message.Email,
		Message:       message.Message,
		MessageLength: len(message.Message),
		Source:        "patrickfanella-co",
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, n.url, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	return doRequest(n.client, req)
}

// shared

func doRequest(client *http.Client, req *http.Request) error {
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		responseBody, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return fmt.Errorf("returned status %d: %s", resp.StatusCode, strings.TrimSpace(string(responseBody)))
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
