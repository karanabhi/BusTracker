defmodule BusTracker.SearchesTest do
  use BusTracker.DataCase

  alias BusTracker.Searches

  describe "searches" do
    alias BusTracker.Searches.Search

    @valid_attrs %{query: "some query"}
    @update_attrs %{query: "some updated query"}
    @invalid_attrs %{query: nil}

    def search_fixture(attrs \\ %{}) do
      {:ok, search} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Searches.create_search()

      search
    end

    test "list_searches/0 returns all searches" do
      search = search_fixture()
      assert Searches.list_searches() == [search]
    end

    test "get_search!/1 returns the search with given id" do
      search = search_fixture()
      assert Searches.get_search!(search.id) == search
    end

    test "create_search/1 with valid data creates a search" do
      assert {:ok, %Search{} = search} = Searches.create_search(@valid_attrs)
      assert search.query == "some query"
    end

    test "create_search/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Searches.create_search(@invalid_attrs)
    end

    test "update_search/2 with valid data updates the search" do
      search = search_fixture()
      assert {:ok, search} = Searches.update_search(search, @update_attrs)
      assert %Search{} = search
      assert search.query == "some updated query"
    end

    test "update_search/2 with invalid data returns error changeset" do
      search = search_fixture()
      assert {:error, %Ecto.Changeset{}} = Searches.update_search(search, @invalid_attrs)
      assert search == Searches.get_search!(search.id)
    end

    test "delete_search/1 deletes the search" do
      search = search_fixture()
      assert {:ok, %Search{}} = Searches.delete_search(search)
      assert_raise Ecto.NoResultsError, fn -> Searches.get_search!(search.id) end
    end

    test "change_search/1 returns a search changeset" do
      search = search_fixture()
      assert %Ecto.Changeset{} = Searches.change_search(search)
    end
  end
end
