defmodule BusTrackerWeb.SearchController do
  use BusTrackerWeb, :controller

  alias BusTracker.Searches
  alias BusTracker.Searches.Search

  action_fallback BusTrackerWeb.FallbackController

  def index(conn, _params) do
    searches = Searches.list_searches()
    render(conn, "index.json", searches: searches)
  end

  def create(conn, %{"search" => search_params}) do
    with {:ok, %Search{} = search} <- Searches.create_search(search_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", search_path(conn, :show, search))
      |> render("show.json", search: search)
    end
  end

  def show(conn, %{"id" => id}) do
    search = Searches.get_search!(id)
    render(conn, "show.json", search: search)
  end

  def update(conn, %{"id" => id, "search" => search_params}) do
    search = Searches.get_search!(id)

    with {:ok, %Search{} = search} <- Searches.update_search(search, search_params) do
      render(conn, "show.json", search: search)
    end
  end

  def delete(conn, %{"id" => id}) do
    search = Searches.get_search!(id)
    with {:ok, %Search{}} <- Searches.delete_search(search) do
      send_resp(conn, :no_content, "")
    end
  end
end
