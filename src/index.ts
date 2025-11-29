import { openapi } from "@elysiajs/openapi";
import { Elysia, t } from "elysia";

// custom error function
class AppError extends Error {
  status = 500;
  constructor(public code: number, message: string) {
    super(message);
  }
}

class Logger {
  log(info: string) {
    console.log(info);
  }
}
const app = new Elysia()
  .use(openapi())
  .error({
    AppError,
  })
  .onError(({ code, status, error }) => {
    console.log("Error caught:", { code, status });
    if (code === "INTERNAL_SERVER_ERROR")
      return `${error.message || "Something went wrong!"} `;
  });

app.get("/", ({}) => {
  throw new AppError(500, `Nothing much`);
});

// cb = () => { }
// shape = {}
// path = "/login"
// app.post(path, cb , schema ); => Structure of an method
const cb = ({ body, status }: any) => {
  const { username, password } = body;
  if (username === "admin" && password === "password") {
    //set("session_id", "abcdef123456", { httpOnly: true, secure: true });
    return status(200, {
      success: true,
      message: "Login successful",
      result: { username, role: "admin", password },
    });
  } else {
    return status(401, { message: "Invalid credentials" });
  }
};
// const schema = {
//   body: t.Object({
//     username: t.String({
//       error: "Username/email is required",
//     }),
//     password: t.String({
//       minLength: 6,
//       error: "Password must be at least 6 characters long",
//     }),
//   }),
// };
app
  .use(openapi())
  .model({
    body: t.Object({
      username: t.String({
        error: "Username/email is required",
      }),
      password: t.String({
        minLength: 6,
        error: "Password must be at least 6 characters long",
      }),
    }),
  })
  .post("/login", cb, {
    body: "body",
    detail: {
      summary: "User login",
      description: "Endpoint to authenticate users and provide access tokens.",
      tags: ["Authentication"],
    },
  });

// Logger Decorator Example
app
  .decorate("logging", new Logger())
  .onRequest(({ request, logging }) => {
    console.dir(request, {
      depth: null,
    });
    logging.log(`Request to ${JSON.stringify(request.url)}`);
  })
  .guard({
    query: t.Optional(
      t.Object({
        age: t.Number({ min: 15 }),
      })
    ),
  })
  .resolve(({ query: { age }, status }) => {
    if (!age) return status(401);
    return { age };
  })
  .get("/profile", ({ age }) => age);

// Generate `Cookie`

app.get(
  "/cookie",
  ({ cookie: { visit } }) => {
    visit.value ??= 0;
    visit.value++;

    visit.httpOnly = true;

    return `you have visited ${visit.value} times`;
  },
  {
    cookie: t.Object({
      visit: t.Optional(t.Number()),
    }),
  }
);

app.listen(7558, () => {
  console.log(
    `Elysia is 🏃 on http://${app.server?.hostname}:${app.server?.port}`
  );
});
