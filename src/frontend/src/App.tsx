import { Toaster } from "@/components/ui/sonner";
import AddPromptPage from "@/pages/AddPromptPage";
import PromptDetailPage from "@/pages/PromptDetailPage";
import PromptsListPage from "@/pages/PromptsListPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/prompts" });
  },
});

const promptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/prompts",
  component: PromptsListPage,
});

const promptDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/prompts/$id",
  component: PromptDetailPage,
});

const addPromptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-prompt",
  component: AddPromptPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  promptsRoute,
  promptDetailRoute,
  addPromptRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
