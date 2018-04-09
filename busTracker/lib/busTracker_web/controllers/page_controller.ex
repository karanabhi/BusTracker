defmodule BusTrackerWeb.PageController do
  use BusTrackerWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
