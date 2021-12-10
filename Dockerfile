# [Choice] Debian OS version: bullseye, buster
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

ARG firebase_config
ARG slack_bot_token
ARG slack_siging_secret

ENV PORT=3000
ENV DENO_INSTALL=/deno
ENV APP_ROOT /app/

WORKDIR $APP_ROOT

RUN mkdir -p /deno \
    mkdir -p /app \
    && curl -fsSL https://deno.land/x/install/install.sh | sh \
    && chown -R vscode /deno

COPY ./src /app

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

ENV FIREBASE_CONFIG=$firebase_config \ 
    SLACK_BOT_TOKEN=$slack_bot_token \ 
    SLACK_SIGNING_SECRET=$slack_signing_secret

RUN echo $FIREBASE_CONFIG
RUN echo $SLACK_BOT_TOKEN
RUN echo $SLACK_SIGNING_SECRET

RUN deno cache --no-check=remote /app/app.ts

CMD ["deno", "run", "--no-check=remote", "--allow-read", "--allow-env", "--allow-net", "/app/app.ts"]

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#    && apt-get -y install --no-install-recommends <your-package-list-here>
