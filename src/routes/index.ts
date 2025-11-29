import Elysia from "elysia";

// Define your route modules with version
const routeModules = [
  {
    version: "/api/v1",
    path: "/users",
    method: "get" as const,
    handler: () => "Get all users - V1",
  },
  {
    version: "/api/v1",
    path: "/users/:id",
    method: "get" as const,
    handler: ({ params }) => `Get user ${params.id} - V1`,
  },
  {
    version: "/api/v1",
    path: "/users",
    method: "post" as const,
    handler: ({ body }) => ({ message: "User created - V1", data: body }),
  },
  {
    version: "/api/v1",
    path: "/posts",
    method: "get" as const,
    handler: () => "Get all posts - V1",
  },
  {
    version: "/api/v2",
    path: "/users",
    method: "get" as const,
    handler: () => ({
      users: [],
      version: "v2",
      features: ["pagination", "filters"],
    }),
  },
  {
    version: "/api/v2",
    path: "/posts",
    method: "get" as const,
    handler: (context) => ({
      message: "User created - V1",
      data: context,
    }),
  },
  {
    version: "/api/v2",
    path: "/context",
    method: "get" as const,
    handler: ({ set }) => {
      set.headers["X-Custom-Header"] = "Elysia";
      return "Hello check headers";
    },
  },
];

// Create Elysia app and map routes
const app = new Elysia();

routeModules.forEach(({ version, path, method, handler }) => {
  app[method](`${version}${path}`, handler);
});

export const appRouter = app;
