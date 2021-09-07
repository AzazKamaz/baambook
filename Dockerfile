FROM elixir:1.12-alpine AS build

RUN apk add --no-cache build-base npm

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
RUN mix do deps.get, deps.compile

COPY assets/package.json assets/package-lock.json ./assets/
RUN mix assets.deps.get

COPY assets assets
RUN mix assets.compile

COPY config config
RUN mix phx.digest

COPY lib lib
RUN mix do compile, release



FROM elixir:1.12-alpine
RUN apk add --no-cache openssl ncurses-libs

WORKDIR /app
ENV PATH="/app:${PATH}"

RUN chown nobody:nobody /app

RUN printf "#!/bin/sh\nset -xe\n./baambook/bin/baambook start" > ./start
RUN printf "#!/bin/sh\nset -xe\n./baambook/bin/baambook rpc $@" > ./rpc
RUN printf "#!/bin/sh\nset -xe\n./baambook/bin/baambook remote" > ./remote
RUN chmod +x ./start ./rpc ./remote

USER nobody:nobody

COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/baambook ./baambook/

ENV HOME=/app

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["start"]