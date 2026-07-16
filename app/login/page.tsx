import {
    Suspense,
} from "react";

import LoginForm from "./LoginForm";

function LoginFallback() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <section className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2">
                    Log in
                </h1>

                <p className="text-gray-600">
                    Loading login form...
                </p>
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