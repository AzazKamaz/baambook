defmodule BaambookWeb.RoomChannel do
  @moduledoc """
  Module that defines channel interface for sending and recieving QR Codes
  """

  use Phoenix.Channel
  require Baambook.Storage

  # Explicitly join to random without touching storage
  # Explicitly disallow sending updates
  @impl true
  def join("room:random", %{}, socket) do
    {:ok, socket}
  end

  @impl true
  def join("room:" <> room_id, %{"token" => token}, socket) do
    case Baambook.Storage.initiate(room_id, token) do
      :ok ->
        reply = %{"data" => Baambook.Storage.get(room_id)}
        send(self(), :after_join)
        {:ok, reply, %{socket | assigns: Map.put(socket.assigns, room_id, token)}}

      :error ->
        {:error, %{reason: "forbidden"}}
    end
  end

  @impl true
  def join("room:" <> room_id, %{}, socket) do
    reply = %{"data" => Baambook.Storage.get(room_id)}
    send(self(), :after_join)
    {:ok, reply, %{socket | assigns: Map.delete(socket.assigns, room_id)}}
  end

  @impl true
  def handle_info(:after_join, %{:topic => "room:" <> room_id} = socket) do
    reply = %{"data" => Baambook.Storage.get(room_id)}
    push(socket, "init", reply)
    {:noreply, socket}
  end

  def handle_info(%{type: "update", data: data}, socket) do
    reply = %{"data" => data}
    push(socket, "update", reply)
    {:noreply, socket}
  end

  @impl true
  def handle_in("update", %{"data" => data}, %{:topic => "room:" <> room_id} = socket) do
    case Map.get(socket.assigns, room_id) do
      nil ->
        {:reply, :error, socket}

      token ->
        Baambook.Storage.update(room_id, token, data)
        reply = %{"data" => data}
        broadcast_from!(socket, "update", reply)
        {:reply, {:ok, reply}, socket}
    end
  end

  @impl true
  def handle_in(_, _, socket) do
    {:reply, :error, socket}
  end
end
