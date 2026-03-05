import React from 'react'
import { User } from '@prisma/client'
import Image from 'next/image'

export default function ProfileCard({ user, entries }: { user: User, entries: [string, string][] }) {
    return (
        <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="relative">
                <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                <div className="absolute -bottom-8 left-6">
                    <div className="relative size-16 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-lg">
                        {user.avatarUrl ? (
                            <Image
                                src={user.avatarUrl}
                                alt={user.stageName}
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center text-2xl font-bold text-muted-foreground">
                                {user.stageName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6 pt-12">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold">
                            {user.stageName}
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            <span className="underline cursor-pointer"> @{user.username}</span> on GitHub
                        </p>
                    </div>

                </div>

                {user.description && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {user.description}
                    </p>
                )}

                {entries.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {entries.map(([k, v]) => (
                            <a
                                key={k}
                                href={String(v)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                            >
                                <span className="capitalize">{k}</span>
                                <svg
                                    className="size-3 text-muted-foreground"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
