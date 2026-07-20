"use client";

import { useState, } from "react";

import type {ReactNode, } from "react";

type Props = {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
};

export default function Accordion({
    title,
    children,
    defaultOpen = false,
}: Props) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-indigo-100 sm:px-6"                onClick={() => setOpen(current => !current)}
                aria-expanded={open}
            >
                <span className="font-semibold text-slate-900">{title}</span>

                <span
                    aria-hidden="true"
                    className={`text-slate-400 transition-transform ${
                        open
                            ? "rotate-180"
                            : ""
                    }`}
                >
                    ▾
                </span>
            </button>

            {open && (
                <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
                    {children}
                </div>
            )}
        </div>
    );
}