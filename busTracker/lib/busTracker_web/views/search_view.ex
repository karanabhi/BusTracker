defmodule BusTrackerWeb.SearchView do
  use BusTrackerWeb, :view
  alias BusTrackerWeb.SearchView
  alias BusTrackerWeb.UserView

  def render("index.json", %{searches: searches}) do
    %{data: render_many(searches, SearchView, "search.json")}
  end

  def render("show.json", %{search: search}) do
    %{data: render_one(search, SearchView, "search.json")}
  end

  def render("search.json", %{search: search}) do
    %{id: search.id,
      query: search.query,
      user: render_one(search.user, UserView, "user.json")}
  end
end
