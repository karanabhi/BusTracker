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

  def handle_in("get_vehicle_data", payload, socket) do

      data = BusTracker.get_vehicle_data(payload["vehicle_id"]);
      socket = socket
               |> assign(:data, data)

      #{:ok, %{"routes" => routes},socket}
        {:reply, {:ok, %{"data" => data}}, socket}

  end


  def handle_in("get_route_info", payload, socket) do

      routes = BusTracker.get_route_info(payload["route_id"], payload["source_id"]);
      socket = socket
               |> assign(:routeInfo, routes)

      #{:ok, %{"routes" => routes},socket}
      {:reply, {:ok, %{"routes" => routes}}, socket}
        #broadcast! socket, "routeUpdate", %{"routes" => routes}

  end

  def handle_in("get_vehicle_updates", payload, socket) do
      BusTracker.VehicleStatus.start_link(payload["id"],payload["vehicle_id"]);
      {:noreply, socket}
  end

  def handle_in("get_route_updates", payload, socket) do
      BusTracker.RouteStatus.start_link(payload["id"],payload["route_id"], payload["source_id"]);
      {:noreply, socket}
  end

  def handle_in("stop_vehicle_updates", payload, socket) do
      BusTracker.VehicleStatus.terminate(%{"id" => payload["id"]});
      {:noreply, socket}
  end

  def handle_in("stop_route_updates", payload, socket) do
      BusTracker.RouteStatus.terminate(%{"id" => payload["id"]});
      {:noreply, socket}
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
