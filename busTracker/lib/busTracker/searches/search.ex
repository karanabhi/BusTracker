defmodule BusTracker.Searches.Search do
  use Ecto.Schema
  import Ecto.Changeset


  schema "searches" do
    field :query, :string
    belongs_to :user, BusTracker.Accounts.User

    timestamps()
  end

  @doc false
  def changeset(search, attrs) do
    search
    |> cast(attrs, [:query, :user_id])
    |> validate_required([:query, :user_id])
  end
end
