defmodule BusTrackerWeb.SearchControllerTest do
  use BusTrackerWeb.ConnCase

  alias BusTracker.Searches
  alias BusTracker.Searches.Search

  @create_attrs %{query: "some query"}
  @update_attrs %{query: "some updated query"}
  @invalid_attrs %{query: nil}

  def fixture(:search) do
    {:ok, search} = Searches.create_search(@create_attrs)
    search
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all searches", %{conn: conn} do
      conn = get conn, search_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create search" do
    test "renders search when data is valid", %{conn: conn} do
      conn = post conn, search_path(conn, :create), search: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, search_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "query" => "some query"}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, search_path(conn, :create), search: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update search" do
    setup [:create_search]

    test "renders search when data is valid", %{conn: conn, search: %Search{id: id} = search} do
      conn = put conn, search_path(conn, :update, search), search: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, search_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "query" => "some updated query"}
    end

    test "renders errors when data is invalid", %{conn: conn, search: search} do
      conn = put conn, search_path(conn, :update, search), search: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete search" do
    setup [:create_search]

    test "deletes chosen search", %{conn: conn, search: search} do
      conn = delete conn, search_path(conn, :delete, search)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, search_path(conn, :show, search)
      end
    end
  end

  defp create_search(_) do
    search = fixture(:search)
    {:ok, search: search}
  end
end
