defmodule BusTracker.RouteStatus do
  use GenServer


  def start_link(id, route_id, source_id) do
    route_status = BusTracker.get_route_info(route_id,source_id);
    GenServer.start_link(__MODULE__, %{"user" => id,"route" => route_status, "route_id" => route_id, "source_id" => source_id}, name: __MODULE__)
  end

  def init(state) do
    schedule_work()
    {:ok, state}
  end

  defp schedule_work() do
    Process.send_after(self(), :update_route, 1000 * 10)
  end

  def handle_info(:update_route, state) do
    route = BusTracker.get_route_info(state["route_id"],state["source_id"]);
    state = %{"user" => state["user"], "route" => route, "route_id" => state["route_id"], "source_id" => state["source_id"]}
    route = %{"routes" => route}
    BusTrackerWeb.Endpoint.broadcast!("tracker:"<>state["user"], "routeUpdate", route)
    schedule_work()
    {:noreply, state}
  end


end
