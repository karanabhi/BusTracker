defmodule BusTracker do
  @moduledoc """
  BusTracker keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """
  #Stops
  def get_stops_data() do
    resp = HTTPoison.get!("https://api-v3.mbta.com/stops")
    data = Poison.decode!(resp.body)
    data["data"]
  end

  def get_stop_attributes() do
    stops = get_stops_data()
    Enum.map stops, fn x ->
      x["data"]["attributes"]
    end
  end

  #Routes
  def get_routes_data(stopId) do
    resp = HTTPoison.get!("https://api-v3.mbta.com/schedules?filter[stop]=#{stopId}")
    data = Poison.decode!(resp.body)
    data["data"]
  end

  def get_route_info(route_id, source_id) do
    resp = HTTPoison.get!("https://api-v3.mbta.com/predictions?filter[stop]=#{source_id}&filter[route]=#{route_id}")

    data = Poison.decode!(resp.body)
    data["data"]

  end

  def get_route_attributes(stopId) do
    routes = get_routes_data(stopId)
    Enum.map routes, fn x ->
      x["data"]["attributes"]
    end
  end
end
