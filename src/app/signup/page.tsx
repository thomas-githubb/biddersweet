"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update profile to include the name
      await updateProfile(userCredential.user, { displayName: formData.name });

      // Send verification email
      await sendEmailVerification(userCredential.user);
      toast.success("Account created! Please verify your email.", {
        position: "bottom-right",
      });

      // Redirect to home
      router.push("/");

      setTimeout(() => {
        window.location.reload();
      }, 500); // Adjust the timeout if necessary
    } catch (err: any) {
      toast.error(err.message, { position: "bottom-right" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-gray-700 to-purple-500 bg-opacity-80 relative">
      <div className="absolute inset-0 bg-stars bg-cover opacity-20"></div>
      <Card className="relative w-full max-w-md p-6 bg-gray-900/70 border border-purple-300 shadow-xl">
        <h2 className="text-3xl font-bold text-center text-purple-200 mb-6">
          Join BidderSuite
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-purple-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full px-4 py-3 text-sm rounded-md bg-gray-800 border border-purple-400 text-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
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
              placeholder="Create a password"
              className="w-full px-4 py-3 text-sm rounded-md bg-gray-800 border border-purple-400 text-purple-200 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-3 text-lg bg-purple-500 hover:bg-purple-600 text-white rounded-md"
          >
            Sign Up
          </Button>
        </form>
      </Card>
    </div>
  );
}
