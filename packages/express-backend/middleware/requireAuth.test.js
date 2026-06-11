import { jest } from "@jest/globals";

const verify = jest.fn();

await jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify
  }
}));

const { requireAuth } = await import("./requireAuth.js");

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
}

describe("requireAuth", () => {
  beforeEach(() => {
    verify.mockReset();
  });

  test("accepts a token from cookies", () => {
    const req = {
      cookies: { token: "cookie-token" },
      headers: {}
    };
    const res = createResponse();
    const next = jest.fn();

    verify.mockReturnValue({ userId: "user-123" });

    requireAuth(req, res, next);

    expect(verify).toHaveBeenCalledWith(
      "cookie-token",
      process.env.JWT_SECRET
    );
    expect(req.userId).toBe("user-123");
    expect(next).toHaveBeenCalled();
  });

  test("falls back to a bearer token", () => {
    const req = {
      cookies: {},
      headers: {
        authorization: "Bearer bearer-token"
      }
    };
    const res = createResponse();
    const next = jest.fn();

    verify.mockReturnValue({ userId: "user-456" });

    requireAuth(req, res, next);

    expect(verify).toHaveBeenCalledWith(
      "bearer-token",
      process.env.JWT_SECRET
    );
    expect(req.userId).toBe("user-456");
    expect(next).toHaveBeenCalled();
  });

  test("returns 401 when authentication is missing", () => {
    const req = {
      cookies: {},
      headers: {}
    };
    const res = createResponse();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing authentication"
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when the token payload is invalid", () => {
    const req = {
      cookies: { token: "bad-payload" },
      headers: {}
    };
    const res = createResponse();
    const next = jest.fn();

    verify.mockReturnValue({});

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid token payload"
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when token verification throws", () => {
    const req = {
      cookies: { token: "expired-token" },
      headers: {}
    };
    const res = createResponse();
    const next = jest.fn();

    verify.mockImplementation(() => {
      throw new Error("expired");
    });

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token"
    });
    expect(next).not.toHaveBeenCalled();
  });
});
