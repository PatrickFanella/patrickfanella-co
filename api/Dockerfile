FROM golang:1.23-alpine AS build

WORKDIR /src/api

COPY api/go.mod api/go.sum ./
RUN go mod download

COPY api/ ./

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags='-s -w' -o /out/server ./cmd/server

FROM alpine:3.21

RUN apk add --no-cache ca-certificates wget \
	&& adduser -D appuser

WORKDIR /app

COPY --from=build /out/server /app/server

EXPOSE 8181

USER appuser

CMD ["/app/server"]
