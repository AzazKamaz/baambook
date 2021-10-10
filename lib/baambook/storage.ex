defmodule Baambook.Storage do
  @moduledoc """
  Module that stores QR Codes in :ets table and checks rights for updating them
  """

  def new() do
    :ets.new(__MODULE__, [:set, :public, :named_table])
    :ok
  end

  defp lookup(id) do
    case :ets.lookup(__MODULE__, id) do
      [result] -> result
      [] -> nil
    end
  end

  defp insert(id, token, data) do
    :ets.insert(__MODULE__, {id, token, data})
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
