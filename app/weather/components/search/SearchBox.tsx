import { useState } from "react";

export default function SearchBox({
    location_data,
    handle_input_change,
    fetch_weather,
    clear_location_data,
}: {
    location_data: string;
    handle_input_change: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fetch_weather: (location_data: string) => void;
    clear_location_data: () => void;
}) {
    return (
        <div className="relative mb-4 shadow-md w-full max-w-3xl mx-auto">
            <div className="flex relative">
                <input
                    type="text"
                    placeholder="Enter city name..."
                    value={location_data}
                    onChange={handle_input_change}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && location_data)
                            fetch_weather(location_data);
                    }}
                    className="w-full px-4 py-2 border border-zinc-800 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 hover:border-zinc-700 ease-in-out transition  focus:ring-offset-0 text-zinc-200 bg-zinc-900" // Added text and background color classes
                    aria-label="City name"
                />
                <button
                    className="absolute right-1 translate-y-1 border-1 p-1 px-2 rounded-md cursor-pointer disabled:border-zinc-800 disabled:bg-zinc-950 
                disabled:text-zinc-500 disabled:cursor-not-allowed disabled:hover:border-zinc-700 disabled:hover:text-zinc-400 border-zinc-700 text-zinc-400
                transition-all ease-in-out bg-zinc-950"
                    onClick={() => {
                        if (location_data) fetch_weather(location_data);
                    }}
                    disabled={!location_data}
                >
                    Search
                </button>
                {location_data && (
                    <button
                        className="absolute right-19 translate-y-3 cursor-pointer opacity-15"
                        onClick={clear_location_data}
                    >
                        <img
                            src="close-icon.svg"
                            className="w-5 h-5 rounded-md hover:border-1"
                            alt=""
                        />
                    </button>
                )}
            </div>
        </div>
    );
}
