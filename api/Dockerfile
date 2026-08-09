FROM golang:1.23-alpine AS build

WORKDIR /src/api

COPY api/go.mod api/go.sum ./
RUN go mod download

COPY api/ ./

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags='-s -w' -o /out/server ./cmd/server \
	&& CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags='-s -w' -o /out/migrate ./cmd/migrate \
	&& CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags='-s -w' -o /out/seed ./cmd/seed

FROM alpine:3.21

RUN apk add --no-cache ca-certificates wget \
	&& adduser -D appuser

WORKDIR /app

COPY --from=build /out/server /out/migrate /out/seed /app/
COPY db/ /app/db/

EXPOSE 8181

USER appuser

CMD ["/app/server"]
