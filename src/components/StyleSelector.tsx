import type { AppStyle } from "@/types/app";

interface StyleSelectorProps {
	value: AppStyle;
	onChange: (style: AppStyle) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={() => onChange("manga")}
				className={`relative transition-all duration-300 transform hover:scale-105 ${
					value === "manga" ? "z-10" : "z-0"
				}`}
			>
				<div
					className={`border-4 border-black px-2 sm:px-4 py-1 sm:py-2 font-black text-xs sm:text-sm relative ${
						value === "manga"
							? "bg-red-500 text-white shadow-[2px_2px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] transform sm:-rotate-2"
							: "bg-white text-black shadow-[1px_1px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100"
					}`}
				>
					🎌 MANGA
				</div>
			</button>

			<div className="text-xl sm:text-2xl font-black text-gray-400">VS</div>

			<button
				type="button"
				onClick={() => onChange("comic")}
				className={`relative transition-all duration-300 transform hover:scale-105 ${
					value === "comic" ? "z-10" : "z-0"
				}`}
			>
				<div
					className={`border-4 border-black px-2 sm:px-4 py-1 sm:py-2 font-black text-xs sm:text-sm relative ${
						value === "comic"
							? "bg-blue-500 text-white shadow-[2px_2px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] transform sm:rotate-2"
							: "bg-white text-black shadow-[1px_1px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100"
					}`}
				>
					💥 COMIC
				</div>
			</button>
		</div>
	);
}
