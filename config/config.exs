import Config

config :baambook, BaambookWeb.Endpoint,
  render_errors: [view: BaambookWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Baambook.PubSub

config :baambook, Baambook.Random,
  interval: 250

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason
config :phoenix, :gzippable_exts, ~w(.js .css .txt .text .html .json .svg .eot .ttf .wasm .map)

import_config "#{config_env()}.exs"
