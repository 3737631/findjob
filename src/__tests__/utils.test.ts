import { describe, it, expect } from "vitest";
import { cn, truncate, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });
});

describe("truncate", () => {
  it("returns string if within limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long strings", () => {
    expect(truncate("hello world this is long", 10)).toBe("hello w...");
  });
});

describe("formatDate", () => {
  it("formats date correctly in Spanish", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("enero");
  });
});
