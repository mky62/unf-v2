"use client";

import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import { useAuth } from "@clerk/nextjs";



export default function Navbar() {
    const { isSignedIn } = useAuth();
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setDropOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="pointer-events-none fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-4">
            <header className="pointer-events-auto w-full max-w-2xl rounded-2xl border bg-background/80 backdrop-blur-md shadow-lg shadow-black/5">
                <div className="flex h-14 items-center justify-between px-5">
                    {/* Logo */}
                    <div className="flex items-center">
                        <NextImage src="/croplogo.png" alt="unfinished" width={110} height={36} className="h-8 w-auto object-contain" />
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Dropdown: More */}
                        <div ref={dropRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setDropOpen((v) => !v)}
                                className="inline-flex h-8 items-center gap-1 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                                More
                                <svg className={`size-3.5 transition-transform ${dropOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>
                            {dropOpen && (
                                <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border bg-card shadow-lg">
                                    <a href="/blog" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent">
                                        <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                        </svg>
                                        Blog
                                    </a>
                                    <a href="/policy" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent">
                                        <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        Policy
                                    </a>
                                </div>
                            )}
                        </div>

                        {isSignedIn ? (
                            <a
                                href="/dashboard"
                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                                </svg>
                                Dashboard
                            </a>
                        ) : (
                            <>
                                <a
                                    href="/sign-up"
                                    className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Get Started
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );
}