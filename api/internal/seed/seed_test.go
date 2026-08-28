package seed

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadPreservesMediaSrcSet(t *testing.T) {
	path := filepath.Join(t.TempDir(), "portfolio.json")
	content := []byte(`{"projects":[{"slug":"demo","media":[{"src":"/demo.png","srcSet":"/demo.png 1x, /demo@2x.png 2x","alt":"Demo"}]}]}`)
	if err := os.WriteFile(path, content, 0o600); err != nil {
		t.Fatalf("write seed: %v", err)
	}

	portfolio, err := Load(path)
	if err != nil {
		t.Fatalf("load seed: %v", err)
	}

	got := portfolio.Projects[0].Media[0].SrcSet
	want := "/demo.png 1x, /demo@2x.png 2x"
	if got != want {
		t.Fatalf("expected srcSet %q, got %q", want, got)
	}
}
