defmodule BaambookWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :baambook

  socket "/socket", BaambookWeb.UserSocket,
    websocket: [
      max_frame_size: 512
    ],
    longpoll: false

  plug :rewrite_index

  plug Plug.Static,
    at: "/",
    from: :baambook,
    gzip: true

  plug :not_found

  defp rewrite_index(conn, _) do
    case conn.path_info do
      [] -> %{conn | request_path: "/index.html", path_info: ["index.html"]}
      _ -> conn
    end
  end

  def not_found(conn, _) do
    send_resp(conn, 404, "not found")
  end
end
