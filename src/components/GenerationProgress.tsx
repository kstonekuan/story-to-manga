import {
	CheckCircle,
	Download,
	Image as ImageIcon,
	Layout,
	Loader2,
	RotateCcw,
	Search,
	Share,
	Users,
} from "lucide-react";
import type { GenerationStep } from "@/types/app";

interface GenerationProgressProps {
	steps: GenerationStep[];
	onImageClick: (url: string) => void;
}

interface StepIconProps {
	stepId: string;
	status: GenerationStep["status"];
}

function StepIcon({ stepId, status }: StepIconProps) {
	const iconMap = {
		analysis: Search,
		characters: Users,
		layout: Layout,
		panels: ImageIcon,
		share: Share,
	};

	const Icon = iconMap[stepId as keyof typeof iconMap] || Search;

	if (status === "completed") {
		return <CheckCircle className="w-5 h-5 text-green-500" />;
	}

	if (status === "in-progress") {
		return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
	}

	return <Icon className="w-5 h-5 text-gray-400" />;
}

function StatusBadge({ status }: { status: GenerationStep["status"] }) {
	const variants = {
		pending: "bg-gray-400 text-white border-black",
		"in-progress": "bg-yellow-400 text-black border-black animate-pulse",
		completed: "bg-green-500 text-white border-black",
		error: "bg-red-500 text-white border-black",
	};

	const labels = {
		pending: "WAITING",
		"in-progress": "WORKING",
		completed: "DONE!",
		error: "ERROR!",
	};

	return (
		<div
			className={`px-3 py-1 border-3 font-black text-xs transform rotate-2 shadow-[2px_2px_0px_0px_#000] ${variants[status]}`}
		>
			{labels[status]}
		</div>
	);
}

function StepContent({
	step,
	onImageClick,
}: {
	step: GenerationStep;
	onImageClick: (url: string) => void;
}) {
	if (step.status !== "completed" || !step.data) {
		return (
			<div className="text-center py-8">
				{step.status === "pending" && (
					<div className="space-y-3">
						<div className="text-6xl">⏳</div>
						<div className="font-bold text-gray-600">WAITING TO START...</div>
					</div>
				)}
				{step.status === "in-progress" && (
					<div className="space-y-3">
						<div className="text-6xl animate-pulse">⚡</div>
						<div className="font-bold text-blue-600">GENERATING CONTENT...</div>
						<div className="text-sm text-gray-500">
							AI is working its magic!
						</div>
					</div>
				)}
				{step.status === "error" && (
					<div className="space-y-3">
						<div className="text-6xl">💥</div>
						<div className="font-bold text-red-600">ERROR OCCURRED!</div>
						<div className="text-sm text-gray-500">{step.error}</div>
					</div>
				)}
			</div>
		);
	}

	switch (step.id) {
		case "analysis": {
			if (
				!step.data ||
				typeof step.data !== "object" ||
				!("title" in step.data)
			)
				return null;
			const analysisData = step.data as {
				title: string;
				characters: Array<{ name: string; role: string; description: string }>;
				setting: { location: string; timeperiod: string; mood: string };
			};
			return (
				<div className="space-y-4">
					{/* Title showcase */}
					<div className="bg-yellow-300 border-4 border-black p-4 text-center transform -rotate-1 shadow-[4px_4px_0px_0px_#000]">
						<h4 className="text-3xl font-black text-black">
							{analysisData.title}
						</h4>
						<p className="font-bold text-black text-sm mt-1">
							★ AI-GENERATED TITLE ★
						</p>
					</div>

					{/* Characters and Setting panels */}
					<div className="grid md:grid-cols-2 gap-4">
						{/* Characters panel */}
						<div className="bg-blue-100 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
							<div className="bg-blue-500 text-white p-2 font-black text-center border-b-4 border-black">
								👥 MAIN CHARACTERS
							</div>
							<div className="p-3 space-y-3">
								{analysisData.characters.map(
									(char: {
										name: string;
										role: string;
										description: string;
									}) => (
										<div
											key={char.name}
											className="bg-white border-2 border-black p-2"
										>
											<div className="font-black text-sm">{char.name}</div>
											<div className="text-xs font-bold text-blue-600">
												{char.role}
											</div>
											<div className="text-xs text-gray-700 mt-1">
												{char.description}
											</div>
										</div>
									),
								)}
							</div>
						</div>

						{/* Setting panel */}
						<div className="bg-green-100 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
							<div className="bg-green-500 text-white p-2 font-black text-center border-b-4 border-black">
								🏙️ STORY SETTING
							</div>
							<div className="p-3 space-y-2">
								<div className="bg-white border-2 border-black p-2">
									<span className="font-black text-xs">LOCATION:</span>
									<div className="font-bold text-sm">
										{analysisData.setting.location}
									</div>
								</div>
								<div className="bg-white border-2 border-black p-2">
									<span className="font-black text-xs">TIME:</span>
									<div className="font-bold text-sm">
										{analysisData.setting.timeperiod}
									</div>
								</div>
								<div className="bg-white border-2 border-black p-2">
									<span className="font-black text-xs">MOOD:</span>
									<div className="font-bold text-sm">
										{analysisData.setting.mood}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex gap-3">
						<button
							type="button"
							className="flex-1 bg-purple-400 border-3 border-black font-black py-2 px-4 hover:bg-purple-300 transition-colors shadow-[3px_3px_0px_0px_#000]"
						>
							<Download className="w-4 h-4 mx-auto mb-1" />
							DOWNLOAD
						</button>
						<button
							type="button"
							className="bg-orange-400 border-3 border-black font-black py-2 px-4 hover:bg-orange-300 transition-colors shadow-[3px_3px_0px_0px_#000]"
						>
							<RotateCcw className="w-4 h-4 mx-auto mb-1" />
							RETRY
						</button>
					</div>
				</div>
			);
		}

		case "characters": {
			if (
				!step.data ||
				typeof step.data !== "object" ||
				!("designs" in step.data)
			)
				return null;
			const charactersDesignData = step.data as {
				designs: Array<{ name: string; url: string }>;
			};
			return (
				<div className="space-y-4">
					{/* Character showcase grid */}
					<div className="grid md:grid-cols-2 gap-4">
						{charactersDesignData.designs.map(
							(design: { name: string; url: string }) => (
								<div
									key={design.name}
									className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden"
								>
									<button
										type="button"
										className="aspect-square bg-gray-100 cursor-pointer hover:scale-105 transition-transform border-b-4 border-black w-full"
										onClick={() => onImageClick(design.url)}
									>
										<img
											src={design.url}
											alt={design.name}
											className="w-full h-full object-cover"
										/>
									</button>
									<div className="p-3 bg-yellow-300">
										<h5 className="font-black text-center">{design.name}</h5>
										<div className="text-xs text-center font-bold mt-1">
											★ CHARACTER DESIGN ★
										</div>
									</div>
								</div>
							),
						)}
					</div>

					{/* Action buttons */}
					<div className="flex gap-3">
						<button
							type="button"
							className="flex-1 bg-purple-400 border-3 border-black font-black py-2 px-4 hover:bg-purple-300 transition-colors shadow-[3px_3px_0px_0px_#000]"
						>
							<Download className="w-4 h-4 mx-auto mb-1" />
							DOWNLOAD ALL
						</button>
						<button
							type="button"
							className="bg-orange-400 border-3 border-black font-black py-2 px-4 hover:bg-orange-300 transition-colors shadow-[3px_3px_0px_0px_#000]"
						>
							<RotateCcw className="w-4 h-4 mx-auto mb-1" />
							RETRY
						</button>
					</div>
				</div>
			);
		}

		case "layout": {
			if (
				!step.data ||
				typeof step.data !== "object" ||
				!("panels" in step.data)
			)
				return null;
			const layoutData = step.data as {
				panels: Array<{ number: number; scene: string; dialogue: string }>;
			};
			return (
				<div className="space-y-4">
					{/* Panel sequence */}
					<div className="space-y-3">
						{layoutData.panels.map(
							(
								panel: { number: number; scene: string; dialogue: string },
								i: number,
							) => (
								<div
									key={panel.number}
									className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4"
								>
									<div className="flex items-start gap-3">
										<div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
											{i + 1}
										</div>
										<div className="flex-1">
											<div className="font-black text-sm mb-2">SCENE:</div>
											<div className="bg-gray-100 border-2 border-gray-400 p-2 text-sm font-bold mb-2">
												{panel.scene}
											</div>
											<div className="font-black text-sm mb-2">DIALOGUE:</div>
											<div className="bg-yellow-100 border-2 border-yellow-400 p-2 text-sm font-bold italic">
												"{panel.dialogue}"
											</div>
										</div>
									</div>
								</div>
							),
						)}
					</div>

					{/* Action buttons */}
					<div className="flex gap-3">
						<button
							type="button"
							className="flex-1 bg-purple-400 border-3 border-black font-black py-2 px-4 hover:bg-purple-300 transition-colors shadow-[3px_3px_0px_0px_#000]"
						>
							<Download className="w-4 h-4 mx-auto mb-1" />
							DOWNLOAD
						</button>
						<button
							type="button"
							className="bg-orange-400 border-3 border-black font-black py-2 px-4 hover:bg-orange-300 transition-colors shadow-[3px_3px_0px_0px_#000]"
						>
							<RotateCcw className="w-4 h-4 mx-auto mb-1" />
							RETRY
						</button>
					</div>
				</div>
			);
		}

		case "panels": {
			if (
				!step.data ||
				typeof step.data !== "object" ||
				!("panels" in step.data)
			)
				return null;
			const panelsData = step.data as {
				panels: Array<{ url: string; id: string }>;
			};
			return (
				<div className="space-y-4">
					{/* Final panels grid */}
					<div className="grid md:grid-cols-2 gap-4">
						{panelsData.panels.map((panel: { url: string; id: string }) => (
							<div
								key={panel.id}
								className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden"
							>
								<button
									type="button"
									className="aspect-[4/3] bg-gray-100 cursor-pointer hover:scale-105 transition-transform border-b-4 border-black w-full"
									onClick={() => onImageClick(panel.url)}
								>
									<img
										src={panel.url}
										alt={`Panel ${panel.id}`}
										className="w-full h-full object-cover"
									/>
								</button>
								<div className="p-2 bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-between">
									<span className="font-black text-white">
										PANEL {panel.id}
									</span>
									<button
										type="button"
										className="bg-white border-2 border-black px-2 py-1 font-black text-xs hover:bg-gray-100"
									>
										<Download className="w-3 h-3" />
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Action buttons */}
					<div className="flex gap-3">
						<button
							type="button"
							className="flex-1 bg-purple-400 border-3 border-black font-black py-2 px-4 hover:bg-purple-300 transition-colors shadow-[3px_3px_0px_0px_#000]"
						>
							<Download className="w-4 h-4 mx-auto mb-1" />
							DOWNLOAD ALL
						</button>
						<button
							type="button"
							className="bg-orange-400 border-3 border-black font-black py-2 px-4 hover:bg-orange-300 transition-colors shadow-[3px_3px_0px_0px_#000]"
						>
							<RotateCcw className="w-4 h-4 mx-auto mb-1" />
							RETRY
						</button>
					</div>
				</div>
			);
		}

		case "share": {
			if (
				!step.data ||
				typeof step.data !== "object" ||
				!("preview" in step.data)
			)
				return null;
			const shareData = step.data as { preview: string };
			return (
				<div className="space-y-4">
					{/* Final shareable image showcase */}
					<div className="text-center">
						<div className="bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black p-4 transform -rotate-1 shadow-[6px_6px_0px_0px_#000] inline-block">
							<h4 className="text-xl font-black text-white mb-2">
								🚀 SHAREABLE IMAGE! 🚀
							</h4>
							<p className="text-sm font-bold text-white opacity-90">
								Ready for social media!
							</p>
						</div>
					</div>

					<div className="max-w-md mx-auto">
						<div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
							<button
								type="button"
								className="aspect-square bg-gray-100 cursor-pointer hover:scale-105 transition-transform border-b-4 border-black w-full"
								onClick={() => onImageClick(shareData.preview)}
							>
								<img
									src={shareData.preview}
									alt="Shareable comic"
									className="w-full h-full object-cover"
								/>
							</button>
							<div className="p-4 bg-gradient-to-r from-yellow-300 to-orange-300">
								<p className="text-sm font-black text-center mb-3">
									1200×1200px - PERFECT FOR SOCIAL!
								</p>
								<button
									type="button"
									className="w-full bg-green-500 border-3 border-black font-black py-3 text-white hover:bg-green-400 transition-colors shadow-[3px_3px_0px_0px_#000]"
								>
									<Download className="w-5 h-5 mx-auto mb-1" />
									DOWNLOAD NOW!
								</button>
							</div>
						</div>
					</div>
				</div>
			);
		}

		default:
			return null;
	}
}

export function GenerationProgress({
	steps,
	onImageClick,
}: GenerationProgressProps) {
	const completedSteps = steps.filter(
		(step) => step.status === "completed",
	).length;
	const totalSteps = steps.length;
	const progressPercentage = (completedSteps / totalSteps) * 100;

	return (
		<div className="space-y-4">
			{/* Progress Header */}
			<div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] p-4">
				<div className="text-center space-y-3">
					{/* Progress counter */}
					<div className="flex items-center justify-center gap-2">
						<div className="bg-black text-white px-3 py-1 font-black text-sm border-2 border-black">
							STEP {Math.min(completedSteps + 1, totalSteps)}
						</div>
						<div className="text-2xl font-black">OF</div>
						<div className="bg-red-500 text-white px-3 py-1 font-black text-sm border-2 border-black">
							{totalSteps}
						</div>
					</div>

					{/* Manga-style progress bar */}
					<div className="relative">
						<div className="w-full bg-gray-200 border-3 border-black h-6">
							<div
								className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 relative overflow-hidden"
								style={{ width: `${progressPercentage}%` }}
							>
								<div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)_4px,transparent_4px,transparent_8px)]" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Generation Steps as Manga Panels */}
			<div className="space-y-4">
				{steps.map((step, index) => (
					<div key={step.id} className="relative">
						{/* Step Panel */}
						<div
							className={`bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden ${
								step.status === "completed"
									? "transform hover:scale-102 transition-transform cursor-pointer"
									: ""
							}`}
						>
							{/* Panel header */}
							<div
								className={`p-3 border-b-4 border-black flex items-center justify-between ${
									step.status === "completed"
										? "bg-green-400"
										: step.status === "in-progress"
											? "bg-yellow-400"
											: "bg-gray-300"
								}`}
							>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-sm">
										{index + 1}
									</div>
									<h4 className="font-black text-lg text-black">
										{step.title}
									</h4>
								</div>

								<StatusBadge status={step.status} />
							</div>

							{/* Panel content */}
							<div className="p-4">
								<StepContent step={step} onImageClick={onImageClick} />
							</div>

							{/* Status icon overlay */}
							<div className="absolute top-2 right-2">
								<StepIcon stepId={step.id} status={step.status} />
							</div>
						</div>

						{/* Connection line to next panel */}
						{index < steps.length - 1 && (
							<div className="flex justify-center py-2">
								<div className="w-1 h-8 bg-black" />
							</div>
						)}
					</div>
				))}
			</div>

			{/* Final action panel */}
			{completedSteps > 0 && (
				<div className="bg-purple-400 border-4 border-black shadow-[6px_6px_0px_0px_#000] p-4 transform -rotate-1">
					<div className="space-y-3">
						<div className="text-center">
							<div className="font-black text-xl text-black">
								MISSION COMPLETE!
							</div>
							<div className="text-sm font-bold text-black opacity-80">
								{completedSteps} of {totalSteps} steps finished
							</div>
						</div>

						<div className="flex gap-3">
							<button
								type="button"
								className="flex-1 bg-white border-3 border-black font-black py-2 px-4 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-[3px_3px_0px_0px_#000]"
							>
								<Download className="w-4 h-4 mx-auto mb-1" />
								DOWNLOAD ALL
							</button>
							<button
								type="button"
								className="bg-white border-3 border-black font-black py-2 px-4 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-[3px_3px_0px_0px_#000]"
							>
								EXPAND
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
