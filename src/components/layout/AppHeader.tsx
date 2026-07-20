import Link from "next/link";

import LogoutButton from "@/src/components/auth/LogoutButton";

type Props = {
    userName?: string | null;
};

export default function AppHeader({
    userName,
}: Props) {
    if (!userName) {
        return null;
    }

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                    aria-label="Noema home"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
                        N
                    </span>

                    <span className="text-lg font-bold tracking-tight text-slate-900">
                        Noema
                    </span>
                </Link>

                <nav
                    aria-label="Main navigation"
                    className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-slate-100 pt-3 [scrollbar-width:none] sm:order-2 sm:w-auto sm:border-0 sm:pt-0"
                >
                    <Link
                        href="/"
                        className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                        Home
                    </Link>

                    <Link
                        href="/events"
                        className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                        Record Event
                    </Link>

                    <Link
                        href="/events-list"
                        className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                        Event History
                    </Link>

                    <Link
                        href="/analytics"
                        className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                        Analytics
                    </Link>
                </nav>

                <div className="order-2 flex items-center gap-3 sm:order-3">
                    <span className="hidden max-w-32 truncate text-sm text-slate-500 md:block">
                        {userName}
                    </span>

                    <LogoutButton />
                </div>
            </div>
        </header>
    );
}