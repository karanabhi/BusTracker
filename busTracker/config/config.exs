# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :busTracker,
  ecto_repos: [BusTracker.Repo]

# Configures the endpoint
config :busTracker, BusTrackerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "JaCBtD5ASGTZpBHZC0wrr5GDKNY0m7LumNm0Zqrw5b7hVPrYoQWPnBhbnjU5pvCW",
  render_errors: [view: BusTrackerWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: BusTracker.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
