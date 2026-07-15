"use client";

import {
    FormEvent,
    useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const router =
        useRouter();

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [error, setError] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (
            password !==
            confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );

            return;
        }

        setIsSubmitting(true);

        try {
            const response =
                await fetch(
                    "/api/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                setError(
                    data.error ??
                    "Registration failed."
                );

                return;
            }

            const signInResult =
                await signIn(
                    "credentials",
                    {
                        email,
                        password,
                        redirect: false,
                    }
                );

            if (
                !signInResult ||
                signInResult.error
            ) {
                router.push(
                    "/login"
                );

                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError(
                "Registration failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <section className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2">
                    Create account
                </h1>

                <p className="mb-8 text-gray-600">
                    Start tracking your own data.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 font-medium"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            required
                            minLength={2}
                            maxLength={80}
                            value={name}
                            onChange={
                                event =>
                                    setName(
                                        event.target.value
                                    )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 font-medium"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={
                                event =>
                                    setEmail(
                                        event.target.value
                                    )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={password}
                            onChange={
                                event =>
                                    setPassword(
                                        event.target.value
                                    )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block mb-2 font-medium"
                        >
                            Confirm password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={
                                event =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded bg-black text-white px-4 py-2 disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>

                <p className="mt-6">
                    Already registered?{" "}
                    <Link
                        href="/login"
                        className="underline"
                    >
                        Log in
                    </Link>
                </p>
            </section>
        </main>
    );
}