"use client";

import { useState, ReactNode } from "react";

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
        <div className="border rounded-lg mb-4">
            <button
                className="w-full flex justify-between items-center p-4 font-semibold"
                onClick={() => setOpen(!open)}
            >
                <span>{title}</span>
            </button>

            {open && (
                <div className="p-4 border-t">
                    {children}
                </div>
            )}
        </div>
    );
}