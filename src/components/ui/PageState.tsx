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
            className="rounded border p-6 text-gray-600"
        >
            {message}
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
            className="rounded border border-red-200 bg-red-50 p-6 text-red-700"
        >
            <p className="font-medium">
                Something went wrong
            </p>

            <p className="mt-1">
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
        <div className="rounded border border-dashed p-8 text-center mt-3">
            <h2 className="text-lg font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-gray-600">
                {description}
            </p>

            {actionHref &&
                actionLabel && (
                    <Link
                        href={actionHref}
                        className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
                    >
                        {actionLabel}
                    </Link>
                )}

            {children}
        </div>
    );
}