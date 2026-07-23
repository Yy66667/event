"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { API_BASE } from "../../lib/constants";

type LoginResponse = {
  detail?: string;
  access_token?: string;
  vendor?: unknown;
};

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setError(data.detail || "Unable to sign in.");
        return;
      }
      if (!data.access_token || !data.vendor) {
        setError("The server returned an invalid login response.");
        return;
      }

      // This preserves the project's existing client-side auth storage pattern.
      localStorage.setItem("vendor", JSON.stringify(data.vendor));
      localStorage.setItem("access_token", data.access_token);
      router.push("/vendor/dashboard");
    } catch (requestError) {
      console.error(requestError);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form onSubmit={login} className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold">Vendor Login</h1>

        <label className="mb-1 block text-sm font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mb-4 w-full rounded-lg border p-3"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="mb-6 w-full rounded-lg border p-3"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Approved partner?{" "}
          <Link href="/vendor/create-account" className="font-medium text-black underline">
            Create your account
          </Link>
        </p>
      </form>
    </div>
  );
}
