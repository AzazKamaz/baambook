defmodule Baambook.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    {:ok, [redis: redis_url]} = Application.fetch_env(:baambook, __MODULE__)

    children = [
      {Redix, {redis_url, [name: :redix]}},
      Baambook.Storage,
      {Phoenix.PubSub, name: Baambook.PubSub},
      BaambookWeb.Endpoint,
      Baambook.Random
    ]

    opts = [strategy: :one_for_one, name: Baambook.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    BaambookWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
