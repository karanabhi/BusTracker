defmodule BusTracker.Repo.Migrations.CreateSearches do
  use Ecto.Migration

  def change do
    create table(:searches) do
      add :query, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:searches, [:user_id])
  end
end
