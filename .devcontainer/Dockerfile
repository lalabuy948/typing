FROM alpine:3.12.0

# Install alp packages
RUN apk add bash zsh curl git

# Install node
RUN apk add --update nodejs npm

# Install go
COPY --from=golang:1.14.4-alpine /usr/local/go/ /usr/local/go/

ENV PATH=$PATH:/usr/local/go/bin

# Install zsh
RUN sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
