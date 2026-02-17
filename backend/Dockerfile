# Build Stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod ./
# COPY go.sum ./ # Not created yet, will be created by mod download if files exist
RUN go mod download

COPY . .

RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Run Stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
