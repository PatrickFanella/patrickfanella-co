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
		*dest[2].(*string) = "Summary"
		*dest[3].(*string) = "Description"
		*dest[4].(*string) = "Full stack developer"
		*dest[5].(*int) = 2025
		*dest[6].(*bool) = true
		*dest[9].(*[]string) = []string{"Go", "React"}
		*dest[10].(*[]string) = []string{"Highlight"}
		*dest[11].(*[]string) = []string{"Architecture"}
		*dest[12].(*[]string) = []string{"Lesson"}
		*dest[13].(*[]byte) = []byte(`[{"src":"/assets/projects/clpr-overview.svg","alt":"Architecture diagram"}]`)
		return nil
	})
	if err != nil {
		t.Fatalf("scan project: %v", err)
	}

	if len(project.Media) != 1 || project.Media[0].Src == "" {
		t.Fatalf("expected decoded media payload, got %#v", project)
	}
}
