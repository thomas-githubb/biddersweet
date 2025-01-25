"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Logged in successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-gray-700 to-purple-500 bg-opacity-80 relative">
      <div className="absolute inset-0 bg-stars bg-cover opacity-20"></div>
      <Card className="relative w-full max-w-md p-6 bg-gray-900/70 border border-purple-300 shadow-xl">
        <h2 className="text-3xl font-bold text-center text-purple-200 mb-6">
          Welcome Back to BidderSweet
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-purple-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-sm rounded-md bg-gray-800 border border-purple-400 text-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-purple-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 text-sm rounded-md bg-gray-800 border border-purple-400 text-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 text-lg bg-purple-500 hover:bg-purple-600 text-white rounded-md"
          >
            Log In
          </Button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <div className="mt-6 text-center text-sm text-purple-300">
          New here?{" "}
          <a href="/signup" className="text-purple-400 hover:underline">
            Create an account
          </a>
        </div>
      </Card>
    </div>
  );
}
