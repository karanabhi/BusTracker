defmodule BusTrackerWeb.Router do
  use BusTrackerWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", BusTrackerWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/tracker", PageController, :index
    get "/register", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api/v1", BusTrackerWeb do
    pipe_through :api

    post "/token", TokenController, :create
    resources "/users", UserController, except: [:new, :edit]
    resources "/searches", SearchController, except: [:new, :edit]
    resources "/recent", SearchController, except: [:new, :edit]
  end
end
