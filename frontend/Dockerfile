FROM node:14.3.0-alpine3.11 AS build-env

WORKDIR /frontend
COPY . .

# 1) Use docker as builder (node_modules not going to be mounted to the host)
# docker build -t typing-fronted -f Dockerfile .
# docker run -v $(pwd)/:/frontend typing-frontend npm install
# docker run -v $(pwd)/:/frontend typing-frontend npm run build
