package store

import (
	"context"
	"errors"
	"testing"

	"patrickfanella.co/api/internal/models"
)

func TestListProjectsReturnsDatabaseUnavailableWithoutDB(t *testing.T) {
	st := &Store{}

	_, err := st.ListProjects(context.Background())
	if !errors.Is(err, models.ErrDatabaseUnavailable) {
		t.Fatalf("expected database unavailable, got %v", err)
	}
}

func TestGetProjectReturnsDatabaseUnavailableWithoutDB(t *testing.T) {
	st := &Store{}

	_, err := st.GetProject(context.Background(), "clpr")
	if !errors.Is(err, models.ErrDatabaseUnavailable) {
		t.Fatalf("expected database unavailable, got %v", err)
	}
}

func TestSaveContactReturnsDatabaseUnavailableWithoutDB(t *testing.T) {
	st := &Store{}

	_, err := st.SaveContact(context.Background(), models.ContactInput{Name: "Patrick", Email: "patrick@example.com", Message: "hello world"})
	if !errors.Is(err, models.ErrDatabaseUnavailable) {
		t.Fatalf("expected database unavailable, got %v", err)
	}
}

func TestScanProjectDecodesMediaPayload(t *testing.T) {
	project, err := scanProject(func(dest ...any) error {
		*dest[0].(*string) = "clpr"
		*dest[1].(*string) = "Clpr"
		*dest[2].(*string) = ""
		*dest[3].(*string) = "Summary"
		*dest[4].(*string) = "Description"
		*dest[5].(*string) = "Full stack developer"
		*dest[6].(*int) = 2025
		*dest[7].(*bool) = true
		*dest[10].(*[]string) = []string{"Go", "React"}
		*dest[11].(*[]string) = []string{"Highlight"}
		*dest[12].(*[]string) = []string{"Architecture"}
		*dest[13].(*[]string) = []string{"Lesson"}
		*dest[14].(*[]byte) = []byte(`[{"src":"/assets/projects/clpr-overview.svg","alt":"Architecture diagram"}]`)
		return nil
	})
	if err != nil {
		t.Fatalf("scan project: %v", err)
	}

	if len(project.Media) != 1 || project.Media[0].Src == "" {
		t.Fatalf("expected decoded media payload, got %#v", project)
	}

	if project.Kind != "case-study" {
		t.Fatalf("expected default kind case-study, got %q", project.Kind)
	}
}
