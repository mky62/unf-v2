"use client";

import Navbar from "./components/Navbar";

const features = [
    {
        icon: (
            <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        ),
        title: "GitHub-Powered",
        description: "Automatically syncs your public GitHub repositories into a clean, browsable portfolio.",
    },
    {
        icon: (
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: "Cached & Fast",
        description: "Repos are cached in a database so your profile loads instantly — no GitHub API calls on every visit.",
    },
    {
        icon: (
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
        ),
        title: "Custom Identity",
        description: "Set a custom stage name and bio, add social links, and control whether your profile is public or private.",
    },
    {
        icon: (
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
        ),
        title: "Discoverable",
        description: "Anyone can search for developers by name and view their public portfolio without needing an account.",
    },
];


export default function HomePage() {

    return (
        <div className="min-h-screen w-full">
            <Navbar />

            <div className="h-full max-w-7xl mx-auto pt-25 ">
                <div className='bg-blue-500 h-[calc(100vh-120px)] w-full rounded-tr-2xl rounded-tl-2xl'></div>
            </div>
        </div>
    )

}
