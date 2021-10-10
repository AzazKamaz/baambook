defmodule Baambook.Storage do
  @moduledoc """
  Module that stores QR Codes in :ets table and checks rights for updating them
  """

  use GenServer

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl true
  def init(_opts) do
    :ets.new(__MODULE__, [:set, :public, :named_table])
    {:ok, nil, :hibernate}
  end

  defp lookup(id) do
    case :ets.lookup(__MODULE__, id) do
      [result] ->
        result

      [] ->
        case Redix.command!(:redix, ["GET", id]) do
          nil ->
            nil

          data ->
            result = List.to_tuple(Jason.decode!(data))
            :ets.insert(__MODULE__, result)
            result
        end
    end
  end

  defp insert(id, token, data) do
    data = {id, token, data}

    Redix.command!(:redix, ["SET", id, Jason.encode!(Tuple.to_list(data))])

    :ets.insert(__MODULE__, data)
    :ok
  end

  def get(id) do
    case lookup(id) do
      {_, _, data} -> data
      nil -> nil
    end
  end

  def update(id, token, data) do
    case lookup(id) do
      {_, old_token, _} when old_token != token ->
        :error

      _ ->
        insert(id, token, data)
        :ok
    end
  end

  def initiate(id, token) do
    case lookup(id) do
      nil -> insert(id, token, nil)
      {_, ^token, data} -> insert(id, token, data)
      {_, _, _} -> :error
    end
  end
end
