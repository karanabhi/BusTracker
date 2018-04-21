defmodule BusTracker.VehicleStatus do
  use GenServer


  def start_link(id, vehicle_id) do
    current_vehicle_status = BusTracker.get_vehicle_data(vehicle_id);
    GenServer.start_link(__MODULE__, %{"user" => id,"vehicle" => current_vehicle_status, "vehicle_id" => vehicle_id}, name: String.to_atom(vehicle_id))

  end

  def init(state) do
    schedule_work()
    {:ok, state}
  end

  defp schedule_work() do
    Process.send_after(self(), :update_vehicle, 1000 * 10)
  end

  def handle_info(:update_vehicle, state) do
    vehicle = BusTracker.get_vehicle_data(state["vehicle_id"]);
    state = %{"user" => state["user"], "vehicle" => vehicle, "vehicle_id" => state["vehicle_id"]}
    vehicle = %{"data" => vehicle}
    BusTrackerWeb.Endpoint.broadcast!("tracker:"<>state["user"], "vehicleUpdate", vehicle)
    schedule_work()
    {:noreply, state}
  end

  def terminate(state) do
    if state["id"] != nil do
      Process.exit(GenServer.whereis(String.to_atom(state["id"])) , :kill)
    end
  end
end
