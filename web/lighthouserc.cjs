const webPort = process.env.E2E_WEB_PORT || '4173'

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--headless --no-sandbox',
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1 },
      },
      startServerCommand: 'bash ./scripts/start-production-preview.sh',
      startServerReadyPattern: 'Portfolio preview ready',
      url: [`http://127.0.0.1:${webPort}/`, `http://127.0.0.1:${webPort}/projects`, `http://127.0.0.1:${webPort}/contact`],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
}
