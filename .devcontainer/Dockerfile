FROM mcr.microsoft.com/vscode/devcontainers/go:dev-1.16

RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install 14 2>&1"

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git wget zsh

EXPOSE 8080
EXPOSE 3000
