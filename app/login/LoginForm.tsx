"use client";

import {
    useState,
} from "react";

import type {SubmitEventHandler} from "react";

import Link from "next/link";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import { signIn } from "next-auth/react";

export default function LoginForm() {
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

    const handleSubmit:
        SubmitEventHandler<HTMLFormElement> =
        async event => {
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
        };

    return (
        <main className="min-h-screen px-4 py-10 sm:flex sm:items-center sm:justify-center">
            <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
                        N
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        Log in
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        Access your Noema account.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="field-label"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={event =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            className="field-input"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="field-label"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={event =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            className="field-input"
                        />
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="button-primary w-full"
                    >
                        {isSubmitting
                            ? "Logging in..."
                            : "Log in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    No account yet?{" "}
                    <Link
                        href="/register"
                        className="text-link"
                    >
                        Register
                    </Link>
                </p>

                <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900">
                    <p className="font-semibold">
                        Demo account
                    </p>

                    <p className="mt-2">
                        Email: demo@noema.local
                    </p>

                    <p>
                        Password: demo12345
                    </p>
                </div>
            </section>
        </main>
    );
}