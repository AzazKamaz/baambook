FROM elixir:1.12-alpine AS build

RUN apk add --no-cache build-base npm

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
RUN mix do deps.get, deps.compile

COPY assets/package.json assets/package-lock.json ./assets/
RUN mix do assets.deps.get

COPY assets assets
RUN mix do assets.compile

COPY config config
RUN mix phx.digest

COPY lib lib
RUN mix do compile, release



FROM alpine:3.9
RUN apk add --no-cache openssl ncurses-libs

WORKDIR /app

RUN chown nobody:nobody /app

USER nobody:nobody

COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/baambook ./

ENV HOME=/app

CMD ["bin/baambook", "start"]