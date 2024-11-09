"use client";

import { useState } from "react";

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e: { target: { name: string; value: string } }) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <>
      <h1 className="mb-5 mt-10 text-5xl text-slate-200">Create Account</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col"
      >
        <div>
          <input
            value={formData.username}
            onChange={handleChange}
            name="username"
            type="text"
            placeholder="Username"
            className="input-bordered input-accent input mb-3 w-full text-center"
          />
        </div>
        <div>
          <input
            value={formData.email}
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Email Address"
            className="input-bordered input-accent input mb-3 w-full text-center"
          />
        </div>
        <div>
          <input
            value={formData.password}
            onChange={handleChange}
            name="password"
            type="password"
            placeholder="Password"
            className="input-bordered input-accent input mb-3 w-full text-center"
          />
        </div>
        <button type="submit" className="btn-accent btn">Sign Up</button>
      </form>
    </>
  );
}
