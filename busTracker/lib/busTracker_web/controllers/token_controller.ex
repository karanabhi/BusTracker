defmodule BusTrackerWeb.TokenController do
  use BusTrackerWeb, :controller
  alias BusTracker.Accounts.User

  action_fallback BusTrackerWeb.FallbackController

  def create(conn, %{"email" => email, "pass" => pass})  do
    with {:ok, %User{} = user} <- BusTracker.Accounts.get_and_auth_user(email, pass) do
      token = Phoenix.Token.sign(conn, "auth token", user.id)
      conn
      |> put_status(:created)
      |> render("token.json", user: user, token: token)
    end
  end
end
