"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            type="button"
            onClick={() =>
                signOut({
                    redirectTo:
                        "/login",
                })
            }
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
                Log out
        </button>
    );
}