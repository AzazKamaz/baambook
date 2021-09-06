import Config

if config_env() == :prod do
  # Skip it for now. It will throw an error if it will be needed
  # secret_key_base =
  #   System.get_env("SECRET_KEY_BASE") ||
  #     raise """
  #     environment variable SECRET_KEY_BASE is missing.
  #     You can generate one by calling: mix phx.gen.secret
  #     """
  # config :baambook, BaambookWeb.Endpoint,
  #   secret_key_base: secret_key_base
end

hostname = case config_env() do
  :prod ->
    System.get_env("HTTP_ORIGIN") ||
      raise "environment variable HTTP_ORIGIN is missing."
  _ -> System.get_env("HTTP_ORIGIN") || "localhost"
end

config :baambook, BaambookWeb.Endpoint,
  url: [host: hostname],
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000")
  ]
