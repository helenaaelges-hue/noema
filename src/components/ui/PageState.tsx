import Link from "next/link";
import type {ReactNode} from "react";

type LoadingStateProps = {
    message?: string;
};

export function LoadingState({
    message = "Loading...",
}: LoadingStateProps) {
    return (
        <div
            role="status"
            className="surface-card flex items-center gap-3 text-slate-600"
        >
            <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"
            />

            <span>
                {message}
            </span>
        </div>
    );
}

type ErrorStateProps = {
    message: string;
};

export function ErrorState({
    message,
}: ErrorStateProps) {
    return (
        <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
            <p className="font-semibold">
                Something went wrong
            </p>

            <p className="mt-1 text-sm">
                {message}
            </p>
        </div>
    );
}

type EmptyStateProps = {
    title: string;
    description: string;
    actionHref?: string;
    actionLabel?: string;
    children?: ReactNode;
};

export function EmptyState({
    title,
    description,
    actionHref,
    actionLabel,
    children,
}: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-700">
                ✦
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {title}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                {description}
            </p>

            {actionHref &&
                actionLabel && (
                    <Link
                        href={actionHref}
                        className="button-primary mt-5"
                    >
                        {actionLabel}
                    </Link>
                )}

            {children && (
                <div className="mt-5">
                    {children}
                </div>
            )}
        </div>
    );
}