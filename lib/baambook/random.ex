defmodule Baambook.Random do
  use GenServer

  def start_link(_) do
    interval = case Application.fetch_env(:baambook, __MODULE__) do
      {:ok, [interval: interval]} -> interval
      :error -> :infinity
    end
    GenServer.start_link(__MODULE__, interval, name: __MODULE__)
  end

  def set_interval(interval) do
    GenServer.cast(__MODULE__, {:interval, interval})
  end

  @impl true
  def init(interval) do
    {:ok, tref} = :timer.send_interval(interval, :timer)
    {:ok, tref}
  end

  @impl true
  def handle_info(:timer, state) do
    Phoenix.PubSub.broadcast(
      Baambook.PubSub,
      "room:random",
      %{type: "update", data: Base.encode64(:crypto.strong_rand_bytes(10))}
    )
    {:noreply, state}
  end

  @impl true
  def handle_cast({:interval, interval}, tref) do
    {:ok, :cancel} = :timer.cancel(tref)
    {:ok, tref} = :timer.send_interval(interval, :timer)
    {:noreply, tref}
  end
end
