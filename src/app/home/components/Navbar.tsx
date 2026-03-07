"use client";

import { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import SearchBar from "./Searchbar";

export default function Navbar() {
    const { isSignedIn } = useAuth();
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    return (
        <div className="pointer-events-none fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-5">
            <header className="pointer-events-auto w-full max-w-4xl rounded-2xl border border-white/[0.07] bg-[#e0f2fe] shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex h-[52px] items-center justify-between px-4">

                    {/* Logo */}
                    <a href="/">
                        <h1 className="text-lg font-geom tracking-tight  text-blue-900">RepoLens</h1>
                    </a>

                    <SearchBar />

                    {/* Right side */}
                    <div className="flex items-center gap-1.5">

                        {isSignedIn ? (
                            <a
                                href="/dashboard"
                                className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-gradient-to-br from-blue-300 to-blue-400 px-4 text-[13px] font-semibold text-rose-950 shadow-lg shadow-rose-500/20 transition-all hover:-translate-y-px hover:shadow-rose-500/40"
                            >
                                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                </svg>
                                Dashboard
                            </a>
                        ) : (
                            <a
                                href="/sign-in"
                                className="inline-flex h-8 items-center bg-gradient-to-br from-blue-300 to-blue-400 px-4 rounded-sm px-3.5 text-[13px] font-medium sm:text-sm text-gray/50 transition-colors hover:text-blue-900/90"
                            >
                                Get Started
                            </a>
                        )}

                        {/* Dropdown */}
                        <div ref={dropRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setDropOpen((v) => !v)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.08] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white/40"
                            >
                                <svg
                                    className={`size-3.5 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth={2.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {dropOpen && (
                                <div className="absolute right-0 top-full mt-2.5 w-44 overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-950/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
                                    <a
                                        href="/blog"
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white/90"
                                    >
                                        <svg className="size-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                        </svg>
                                        Blog
                                    </a>
                                    <div className="my-1 h-px bg-white/[0.06]" />
                                    <a
                                        href="/policy"
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white/90"
                                    >
                                        <svg className="size-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        Policy
                                    </a>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </header>
        </div>
    );
}