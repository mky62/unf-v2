"use client";

import GitHubCalendar from "react-github-calendar";

export default function GithubHeatmap({ username }: { username: string }) {
    // Custom theme matching the premium dark & amber aesthetic
    const explicitTheme = {
        light: ["#ebedf0", "#f6e0b3", "#f0c674", "#eaac35", "#d97706"],
        dark: ["#1f1f22", "#78350f", "#92400e", "#b45309", "#d97706"],
    };

    return (
        <div className="w-full flex justify-center py-6 px-4 bg-black/40 border border-amber-600/50 rounded-2xl backdrop-blur-sm shadow-xl mt-4">
            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <GitHubCalendar
                    username={username}
                    theme={explicitTheme}
                    colorScheme="dark"
                    blockSize={12}
                    blockMargin={5}
                    fontSize={14}
                />
            </div>
        </div>
    );
}
