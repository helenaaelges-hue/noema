"use client";

import {
    FormEvent,
    useState,
} from "react";

import Link from "next/link";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    const router =
        useRouter();

    const searchParams =
        useSearchParams();

    const callbackUrl =
        searchParams.get(
            "callbackUrl"
        ) ?? "/";

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const result =
                await signIn(
                    "credentials",
                    {
                        email,
                        password,
                        redirect: false,
                    }
                );

            if (
                !result ||
                result.error
            ) {
                setError(
                    "Incorrect email or password."
                );

                return;
            }

            router.push(callbackUrl);
            router.refresh();
        } catch {
            setError(
                "Login failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <section className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2">
                    Log in
                </h1>

                <p className="mb-8 text-gray-600">
                    Access your Noema account.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
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
                            autoComplete="current-password"
                            required
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
                            ? "Logging in..."
                            : "Log in"}
                    </button>
                </form>

                <p className="mt-6">
                    No account yet?{" "}
                    <Link
                        href="/register"
                        className="underline"
                    >
                        Register
                    </Link>
                </p>

                <div className="mt-8 rounded border p-4 text-sm">
                    <p className="font-medium">
                        Demo account
                    </p>

                    <p>
                        demo@noema.local
                    </p>

                    <p>
                        demo12345
                    </p>
                </div>
            </section>
        </main>
    );
}