defmodule Baambook.MixProject do
  use Mix.Project

  def project do
    [
      app: :baambook,
      version: "0.1.0",
      elixir: "~> 1.7",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Baambook.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.5.12"},
      {:jason, "~> 1.0"},
      {:plug_cowboy, "~> 2.0"},
      {:credo, "~> 1.5", only: :dev, runtime: false}
    ]
  end

  defp aliases do
    [
      "assets.deps.get": ["cmd npm --prefix ./assets clean-install"],
      "assets.compile": ["cmd npm --prefix ./assets run build"],
      "assets.watch": ["cmd npm --prefix ./assets run watch"],
      lint: ["format", "credo"]
    ]
  end
end
