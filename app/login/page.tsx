import {
    Suspense,
} from "react";

import LoginForm from "./LoginForm";

function LoginFallback() {
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
                </div>

                <div
                    role="status"
                    className="flex items-center justify-center gap-3 text-sm text-slate-600"
                >
                    <span
                        aria-hidden="true"
                        className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"
                    />

                    Loading login form...
                </div>
            </section>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <LoginFallback />
            }
        >
            <LoginForm />
        </Suspense>
    );
}