# [Choice] Debian OS version: bullseye, buster
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

ARG FIREBASE_CONFIG
ARG SLACK_BOT_TOKEN
ARG SLACK_SIGNING_SECRET

ENV PORT=3000
ENV DENO_INSTALL=/deno
ENV APP_ROOT /app/
ENV FIREBASE_CONFIG=$FIREBASE_CONFIG
ENV SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN 
ENV SLACK_SIGNING_SECRET=$SLACK_SIGNING_SECRET 

WORKDIR $APP_ROOT

RUN mkdir -p /deno \
    mkdir -p /app \
    && curl -fsSL https://deno.land/x/install/install.sh | sh \
    && chown -R vscode /deno

COPY ./src /app

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

CMD ["deno", "run", "--no-check=remote", "--allow-read", "--allow-env", "--allow-net", "/app/app.ts"]

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#    && apt-get -y install --no-install-recommends <your-package-list-here>
