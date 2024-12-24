import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("authentication", "./routes/authentication/layout.tsx", [
    route('login', "./routes/authentication/login.tsx"),
    route('register', "./routes/authentication/register.tsx"),
  ]),
] satisfies RouteConfig;
