import type { CompareMode } from "./types";

export const SAMPLES: Record<CompareMode, { a: string; b: string }> = {
  env: {
    a: `# Development environment
DATABASE_URL=postgres://localhost:5432/myapp_dev
REDIS_URL=redis://localhost:6379/0
API_KEY=dev_sk_test_abc123
DEBUG=true
LOG_LEVEL=debug
FEATURE_NEW_UI=true
MAX_CONNECTIONS=10`,
    b: `# Production environment
DATABASE_URL=postgres://prod-db.internal:5432/myapp
REDIS_URL=redis://prod-redis.internal:6379/0
API_KEY=prod_sk_live_xyz789
DEBUG=false
LOG_LEVEL=info
FEATURE_NEW_UI=false
SENTRY_DSN=https://sentry.example.com/123
MAX_CONNECTIONS=100`,
  },
  configmap: {
    a: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: staging
data:
  LOG_LEVEL: debug
  DATABASE_HOST: staging-db.internal
  DATABASE_PORT: "5432"
  FEATURE_FLAGS: '{"new_ui":true,"beta_api":true}'
  CACHE_TTL: "300"`,
    b: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: production
data:
  LOG_LEVEL: info
  DATABASE_HOST: prod-db.internal
  DATABASE_PORT: "5432"
  FEATURE_FLAGS: '{"new_ui":false,"beta_api":false}'
  CACHE_TTL: "600"
  RATE_LIMIT: "1000"`,
  },
  yaml: {
    a: `server:
  host: localhost
  port: 8080
  timeout: 30s

database:
  host: localhost
  port: 5432
  pool_size: 5

features:
  - name: auth
    enabled: true
  - name: analytics
    enabled: false

logging:
  level: debug
  format: text`,
    b: `server:
  host: 0.0.0.0
  port: 8080
  timeout: 60s

database:
  host: prod-db.internal
  port: 5432
  pool_size: 20

features:
  - name: auth
    enabled: true
  - name: analytics
    enabled: true
  - name: caching
    enabled: true

logging:
  level: info
  format: json`,
  },
  json: {
    a: `{
  "app": {
    "name": "my-service",
    "version": "1.2.0"
  },
  "server": {
    "host": "uat.example.com",
    "port": 443,
    "ssl": true
  },
  "features": {
    "darkMode": true,
    "betaFeatures": true,
    "maxUploadMB": 10
  },
  "notifications": {
    "email": true,
    "push": false
  }
}`,
    b: `{
  "app": {
    "name": "my-service",
    "version": "1.3.0"
  },
  "server": {
    "host": "api.example.com",
    "port": 443,
    "ssl": true
  },
  "features": {
    "darkMode": true,
    "betaFeatures": false,
    "maxUploadMB": 25
  },
  "notifications": {
    "email": true,
    "push": true
  },
  "monitoring": {
    "enabled": true,
    "sampleRate": 0.1
  }
}`,
  },
};
