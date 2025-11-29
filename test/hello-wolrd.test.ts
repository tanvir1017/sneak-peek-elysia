import { describe, expect, it } from "bun:test";
import Elysia from "elysia";

describe("Elysia", () => {
  it("should return Hello World!", async () => {
    const app = new Elysia().get("/", () => "Hello World!");
    const response = await app.fetch(new Request("http://localhost:7558"));
    const text = await response.text();
    console.log("🚀 ~ text:", text);
    expect(text).toBe("Hello World!");
  });
});
