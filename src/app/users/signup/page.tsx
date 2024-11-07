import Form from "next/form";

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-5 mt-10 text-5xl text-slate-200">Signup</h1>
      <Form action={""} className="flex flex-col">
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="input-bordered input-accent input mb-3 w-full text-center"
          />
        </div>
        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="input-bordered input-accent input mb-3 w-full text-center"
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input-bordered input-accent input mb-3 w-full text-center"
          />
        </div>
        <button type="submit" className="btn-accent btn">Sign Up</button>
      </Form>
    </>
  );
}
