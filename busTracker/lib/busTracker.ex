defmodule BusTracker do
  @moduledoc """
  BusTracker keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

  def get_stops_data() do
    resp = HTTPoison.get!("https://api-v3.mbta.com/stops?page[limit]=20")
    data = Poison.decode!(resp.body)
    data["data"]
  end

  def get_stop_attributes() do
    stops = get_stops_data()
    Enum.map stops, fn x ->
      x["data"]["attributes"]
    end
  end
end
