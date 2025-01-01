import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layouts.tsx", [
    index("routes/home.tsx"),
    route("/lobby", "./routes/home/lobby.tsx"),
    route("/settings", "./routes/home/settings.tsx"),
    route("inventories", "./routes/home/inventory/layout.tsx", [
      route("rocket", "./routes/home/inventory/rocket.tsx"),
      route("gun", "./routes/home/inventory/gun.tsx"),
      route("merc", "./routes/home/inventory/merc.tsx"),
    ]),
    route("/profile", "./routes/home/profile.tsx"),
    // route("/matchmaking", "./routes/home/matchmaking.tsx"),
    // route("/leaderboard", "./routes/home/leaderboard.tsx"),
    // route("/tournament", "./routes/home/tournament.tsx"),
    // route("/community", "./routes/home/community.tsx"),
  ]),
  route("auth", "./routes/authentication/layout.tsx", [
    route("login", "./routes/authentication/login.tsx"),
    route("logout", "./routes/authentication/logout.tsx"),
    route("register", "./routes/authentication/register.tsx"),
    route("forgot-password", "./routes/authentication/forgot-password.tsx"),
    route("activate/:crypto", "./routes/authentication/activate.tsx"),
    route(
      "reset-password/:token",
      "./routes/authentication/reset-password.tsx"
    ),
  ]),
] satisfies RouteConfig;
