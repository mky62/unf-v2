"use client";

import Navbar from "./components/Navbar";
import Image from "next/image";
import HeroBg from '@/public/herobg.jpg'




export default function HomePage() {

    return (
        <div className="min-h-screen w-full flex flex-col relative">
            <Navbar />

            <Image
                src={HeroBg}
                alt="Hero Background"
                fill
                className="object-cover z-[-1]"
            />

            <div className="flex-1 flex items-end">
                <div className="w-full max-w-6xl mx-auto px-6 ">
                    <div className="bg-sky-500/40 h-[700px] rounded-t-4xl w-full
                    overflow-y-scroll
                    [scrollbar-width:none]
                    [-ms-overflow-style:none]
                    [&::-webkit-scrollbar]:hidden
                    [box-shadow:inset_0_20px_40px_rgba(11,11,11,0.4),inset_0_-20px_40px_rgba(255,255,222,0.2)]
                    ">
                        <div className="flex flex-col px-12 py-20 text-white max-w-4xl mx-auto">

                            {/* HERO */}

                            <div className="mb-40">

                                <div className="mb-10 ">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm bg-white/10 border border-white/20 backdrop-blur-md">
                                        ✨ Let’s build it
                                    </span>
                                </div>

                                <h1 className="text-5xl md:text-6xl  font-semibold leading-tight">
                                    Patronage for developers
                                    <br />
                                    in the AI coding era.
                                </h1>

                                <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl">
                                    A new way to support builders. Discover developers creating in the
                                    age of <span className='p-2 font-bold font-geom '>🦾 AI</span>,<span className='underline text-white font-semibold underline-offset-8'>follow their work, and contribute directly to the people
                                        building the future of software.</span>
                                </p>

                                <div className="mt-8 flex gap-4">
                                    <button className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:opacity-90 transition">
                                        Explore Developers
                                    </button>

                                    <button className="px-6 py-3 border border-white/40 rounded-lg hover:bg-white/10 transition">
                                        <a href="/sign-in">Start a Profile</a>
                                    </button>
                                </div>

                            </div>


                            {/* FEATURE COLLAGE */}

                            <div className="grid grid-cols-6 gap-6 mb-40 mt-10">

                                {/* Large Card */}
                                <div className="col-span-4 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition">
                                    <h3 className="text-xl font-semibold mb-3">
                                        Discover Builders
                                    </h3>
                                    <p className="text-white/70">
                                        Explore developers, repositories and real GitHub activity across the ecosystem.
                                    </p>
                                </div>

                                {/* Small Card */}
                                <div className="col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition">
                                    <h3 className="font-medium">
                                        Patronage
                                    </h3>
                                    <p className="text-white/70 text-sm mt-2">
                                        Direct support for developers.
                                    </p>
                                </div>

                                {/* Small Card */}
                                <div className="col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition">
                                    <h3 className="font-medium">
                                        GitHub Insights
                                    </h3>
                                    <p className="text-white/70 text-sm mt-2">
                                        Commits, stars and repos.
                                    </p>
                                </div>

                                {/* Medium Card */}
                                <div className="col-span-4 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition">
                                    <h3 className="text-xl font-semibold mb-3">
                                        Built for the AI Coding Era
                                    </h3>
                                    <p className="text-white/70">
                                        Developers can now build faster than ever. This platform ensures
                                        the builders behind that innovation receive direct support.
                                    </p>
                                </div>

                            </div>


                            {/* FINAL STATEMENT */}

                            <div className="text-center py-24">

                                <div className="relative flex justify-center items-center py-24">

                                    {/* Background glow */}
                                    <div className="absolute w-[700px] h-[700px] bg-blue-500/20 blur-3xl rounded-full"></div>

                                    {/* Decorative grid */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(215, 27, 27, 0.95)_1px,),linear-gradient(90deg,rgba(242, 28, 28, 0.91)_1px)] bg-[size:40px_40px]"></div>

                                    {/* Floating accent shapes */}
                                    <div className="absolute left-20 top-20 w-16 h-16 border border-blue-400 rotate-12 rounded-xl"></div>
                                    <div className="absolute right-24 bottom-16 w-12 h-12 bg-blue-500 blur-xl rounded-full"></div>
                                    <div className="absolute right-40 top-32 w-2 h-24 bg-gradient-to-b from-blue-500 to-transparent"></div>

                                    {/* Content */}
                                    <div className="relative text-center max-w-3xl">

                                        <h2 className="text-4xl md:text-5xl text-blue-600 italic font-semibold leading-tight underline decoration-blue-300 decoration-wavy underline-offset-8">
                                            "The future of software
                                            <br />
                                            belongs to independent builders."
                                        </h2>

                                        {/* Minimal supporting text */}
                                        <p className="mt-6 text-gray-900 text-lg">
                                            Built by creators. Powered by community.
                                        </p>

                                        {/* Decorative divider */}
                                        <div className="flex justify-center mt-10">
                                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                                        </div>

                                    </div>
                                </div>

                                <p className="mt-6 text-white/70 text-lg">
                                    Support the people building the next generation of the internet.
                                </p>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}
