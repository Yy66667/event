"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { API_BASE } from "../../lib/constants";

type AccountResponse = { detail?: string };

export default function VendorCreateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/vendor/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: AccountResponse = await response.json();

      if (!response.ok) {
        setError(data.detail || "Unable to create your account.");
        return;
      }

      router.push("/vendor/login");
    } catch (requestError) {
      console.error(requestError);
      setError("Account creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form onSubmit={createAccount} className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">Create Vendor Account</h1>
        <p className="mb-6 text-sm text-gray-600">
          Use the email address from your approved partner application.
        </p>

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
          autoComplete="new-password"
          minLength={8}
          className="mb-4 w-full rounded-lg border p-3"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          className="mb-6 w-full rounded-lg border p-3"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-50">
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/vendor/login" className="font-medium text-black underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
