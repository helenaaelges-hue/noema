import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth(request => {
    const isLoggedIn =
        Boolean(request.auth);

    const pathname =
        request.nextUrl.pathname;

    const isAuthPage =
        pathname === "/login" ||
        pathname === "/register";

    if (
        isLoggedIn &&
        isAuthPage
    ) {
        return NextResponse.redirect(
            new URL(
                "/",
                request.nextUrl
            )
        );
    }

    if (
        !isLoggedIn &&
        !isAuthPage
    ) {
        const loginUrl =
            new URL(
                "/login",
                request.nextUrl
            );

        loginUrl.searchParams.set(
            "callbackUrl",
            pathname
        );

        return NextResponse.redirect(
            loginUrl
        );
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/",
        "/analytics/:path*",
        "/events/:path*",
        "/categories/:path*",
        "/triggers/:path*",
    ],
};