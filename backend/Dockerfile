# Build stage
FROM golang:1.14.4-alpine3.12 AS build-env

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /go/src/builder

# COPY . .
# RUN go get
# RUN go build -o main

# final stage
# FROM alpine:3.9.5
# WORKDIR /backend
# COPY --from=build-env /go/src/builder/main main
# COPY --from=build-env /go/src/builder/quotes.json quotes.json
# ENTRYPOINT ./main

# 1) Uncomment below to use as app container
# docker build -t typing-backend -f Dockerfile .
# docker run -p 8080:8080 typing-backend

# 2) Use docker as builder
# docker build -t typing-backend -f Dockerfile .
# docker run -v $(pwd)/:/go/src/builder typing-backend go get
# docker run -v $(pwd)/:/go/src/builder typing-backend go build
