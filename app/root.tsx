import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { useEffect } from "react";
import axios, { type CancelTokenSource } from "axios";
import { baseUrl } from "./utils/constants";

import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import {
  setAuthenticationState,
  setUserData,
} from "./redux/authenticationSlice";

axios.defaults.baseURL = `${baseUrl}/api`;
axios.defaults.withCredentials = true;

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

function setFullScreen() {
  document.documentElement.requestFullscreen().then((response) => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation
        .lock("landscape")
        .then(() => {
          console.log("Switched to landscape orientation.");
        })
        .catch((error: Error) => {
          console.error("Orientation lock failed:", error);
        });
    } else {
      alert("Screen Orientation API is not supported on this browser.");
    }
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    addEventListener("click", setFullScreen);
    return () => removeEventListener("click", setFullScreen);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, orientation=landscape"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <div id="rotate-notice">
          Please rotate your device to landscape mode.
        </div>
      </body>
    </html>
  );
}

function Wrapper() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();

    const verifyAuth= async (): Promise<void>  => {
      try {
        if (!isAuthenticated) {
          const response = await axios.get("/auth/verify", {
            cancelToken: source.token, // Attach cancel token to the request
          });
          if (response.status === 200) {
            dispatch(setAuthenticationState(true));
            dispatch(setUserData(response.data?.message));
            console.log("User is authenticated");
          } else {
            dispatch(setAuthenticationState(false));
            console.log("User is not authenticatedhb");
          }
        }
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error during auth verification:", error);
        }
      }
    };

    verifyAuth();

    return () => {
      source.cancel("Component unmounted, request canceled.");
      console.log("Cleanup performed: Axios request canceled.");
    };
  }, []);

  return <Outlet />;
}

export default function App() {
  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
