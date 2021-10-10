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

origin =
  URI.parse(
    case config_env() do
      :prod ->
        System.get_env("HTTP_ORIGIN") ||
          raise "environment variable HTTP_ORIGIN is missing."

      _ ->
        System.get_env("HTTP_ORIGIN") || "//*."
    end
  )

unless origin.host do
  raise "Expected an origin with a host that is parsable by URI.parse/1"
end

IO.puts(:stdio, "HTTP_ORIGIN is " <> inspect(origin))

config :baambook, BaambookWeb.Endpoint,
  check_origin: [origin],
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000")
  ]
