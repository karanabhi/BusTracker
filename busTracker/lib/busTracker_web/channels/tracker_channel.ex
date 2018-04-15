defmodule BusTrackerWeb.TrackerChannel do
  use BusTrackerWeb, :channel

  def join("tracker:" <> name, payload, socket) do

      stops = BusTracker.get_stops_data();
      socket = socket
               |> assign(:stops, stops)
               |> assign(:name, name)

      {:ok, %{"stops" => stops},socket}

  end

  def handle_in("get_routes", payload, socket) do

      routes = BusTracker.get_routes_data(payload["tracker"]);
      socket = socket
               |> assign(:routes, routes)

      #{:ok, %{"routes" => routes},socket}
        {:reply, {:ok, %{"routes" => routes}}, socket}

  end

  def handle_in("get_route_info", payload, socket) do

      routes = BusTracker.get_route_info(payload["id"]);
      socket = socket
               |> assign(:routes, routes)

      #{:ok, %{"routes" => routes},socket}
        {:reply, {:ok, %{"routes" => routes}}, socket}

  end


  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (tracker:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
