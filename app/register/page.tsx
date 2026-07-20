"use client";

import {
    useState,
} from "react";

import type {SubmitEventHandler} from "react";

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

    const handleSubmit:
        SubmitEventHandler<HTMLFormElement> =
        async event => {
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
        };

    return (
        <main className="min-h-screen px-4 py-10 sm:flex sm:items-center sm:justify-center">
            <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
                        N
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        Create account
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        Start tracking your own
                        data.
                    </p>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="field-label"
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
                            onChange={event =>
                                setName(
                                    event.target
                                        .value
                                )
                            }
                            className="field-input"
                        />
                    </div>

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
                                    event.target
                                        .value
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
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={password}
                            onChange={event =>
                                setPassword(
                                    event.target
                                        .value
                                )
                            }
                            className="field-input"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="field-label"
                        >
                            Confirm password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={
                                confirmPassword
                            }
                            onChange={event =>
                                setConfirmPassword(
                                    event.target
                                        .value
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
                        disabled={
                            isSubmitting
                        }
                        className="button-primary w-full"
                    >
                        {isSubmitting
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already registered?{" "}
                    <Link
                        href="/login"
                        className="text-link"
                    >
                        Log in
                    </Link>
                </p>
            </section>
        </main>
    );
}