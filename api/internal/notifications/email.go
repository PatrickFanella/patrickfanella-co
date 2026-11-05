package notifications

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"patrickfanella.co/api/internal/models"
)

// EmailConfig stays server-side. Recipients cannot be supplied by a form visitor.
type EmailConfig struct {
	APIKey string
	From   string
	To     string
}

type emailNotifier struct {
	config   EmailConfig
	client   *http.Client
	endpoint string
}

type emailAddress struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type emailPayload struct {
	Sender      emailAddress      `json:"sender"`
	To          []emailAddress    `json:"to"`
	ReplyTo     emailAddress      `json:"replyTo"`
	Subject     string            `json:"subject"`
	TextContent string            `json:"textContent"`
	HTMLContent string            `json:"htmlContent"`
	Headers     map[string]string `json:"headers"`
}

func (n *emailNotifier) enabled() bool {
	return n.config.APIKey != "" && n.config.From != "" && n.config.To != ""
}
func (n *emailNotifier) name() string { return "email" }

func (n *emailNotifier) notify(ctx context.Context, message models.ContactMessage) error {
	reply, err := mail.ParseAddress(message.Email)
	if err != nil {
		return fmt.Errorf("invalid reply address")
	}
	name := strings.Join(strings.Fields(message.Name), " ")
	subjectName := []rune(name)
	if len(subjectName) > 80 {
		subjectName = subjectName[:80]
	}
	text := fmt.Sprintf("From: %s <%s>\nSubmitted: %s\n\n%s\n", name, reply.Address, message.CreatedAt.UTC().Format(time.RFC3339), message.Message)
	payload := emailPayload{
		Sender:      emailAddress{Email: n.config.From, Name: "Patrick Fanella portfolio"},
		To:          []emailAddress{{Email: n.config.To}},
		ReplyTo:     emailAddress{Email: reply.Address, Name: name},
		Subject:     "Portfolio message from " + string(subjectName),
		TextContent: text,
		HTMLContent: "<pre style=\"white-space:pre-wrap;font:16px/1.5 sans-serif\">" + html.EscapeString(text) + "</pre>",
		Headers:     map[string]string{"IdempotencyKey": fmt.Sprintf("portfolio-contact-%d", message.ID)},
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("encode email")
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, n.endpoint, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build email request")
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", n.config.APIKey)
	response, err := n.client.Do(req)
	if err != nil {
		return fmt.Errorf("email transport failed")
	}
	defer response.Body.Close()
	_, _ = io.Copy(io.Discard, io.LimitReader(response.Body, 4096))
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		// Provider errors can contain the message or address. Keep them out of logs.
		return fmt.Errorf("email provider returned status %d", response.StatusCode)
	}
	return nil
}
