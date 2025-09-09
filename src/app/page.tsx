"use client";

import { ConfirmModal } from "@/components/ConfirmModal";
import { ErrorModal } from "@/components/ErrorModal";
import { GenerationControls } from "@/components/GenerationControls";
import { GenerationProgress } from "@/components/GenerationProgress";
import { Hero } from "@/components/Hero";
import { ImageModal } from "@/components/ImageModal";
import { ImageUploader } from "@/components/ImageUploader";
import { StoryInput } from "@/components/StoryInput";
import { StyleSelector } from "@/components/StyleSelector";
import { Toaster } from "@/components/ui/sonner";
import { useMangaGenerator } from "@/hooks/useMangaGenerator";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
	// Use our custom hook for all manga generation logic
	const {
		story,
		setStory,
		appStyle,
		setAppStyle,
		characterImages,
		setCharacterImages,
		settingImages,
		setSettingImages,
		isGenerating,
		generationSteps,
		wordCount,
		isLoadingState,
		generateComic,
		clearResults,
		clearAllGeneratedData,
	} = useMangaGenerator();

	// Modal states
	const [showImageModal, setShowImageModal] = useState(false);
	const [modalImageUrl, setModalImageUrl] = useState("");
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

	// Handle generation with error handling
	const handleGenerate = async () => {
		try {
			await generateComic();
			toast.success("Comic generated successfully! 🎉");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Generation failed";
			setErrorMessage(message);
			setShowErrorModal(true);
			toast.error("Generation failed");
		}
	};

	// Clear just the generation results
	const handleClearResults = () => {
		clearResults();
		toast.success("Results cleared");
	};

	// Clear all data with confirmation
	const handleClearAll = () => {
		setConfirmAction(() => async () => {
			try {
				await clearAllGeneratedData();
				setShowConfirmModal(false);
				toast.success("All data cleared");
			} catch (error) {
				console.error("Failed to clear data:", error);
				toast.error("Failed to clear data");
			}
		});
		setShowConfirmModal(true);
	};

	const handleImageClick = (url: string) => {
		setModalImageUrl(url);
		setShowImageModal(true);
	};

	// Show loading screen while initializing
	if (isLoadingState) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100 via-yellow-50 to-white">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
					<p className="text-gray-600 font-bold">
						Loading your saved content...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen relative overflow-hidden ${
				appStyle === "manga"
					? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100 via-yellow-50 to-white"
					: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-red-50 to-white"
			}`}
		>
			{/* Comic Book Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="w-full h-full bg-[radial-gradient(circle_at_20%_80%,_#000_1px,_transparent_1px),_radial-gradient(circle_at_80%_20%,_#000_1px,_transparent_1px),_radial-gradient(circle_at_40%_40%,_#000_1px,_transparent_1px)] bg-[length:20px_20px,_30px_30px,_25px_25px]" />
			</div>

			{/* Manga Style Header Panel */}
			<div className="relative z-10">
				<div className="bg-white border-4 border-black mx-2 sm:mx-4 mt-4 rounded-none relative overflow-hidden shadow-[4px_4px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000]">
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500" />
					<div className="p-6">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-8">
							<div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
								{/* Manga Style Title */}
								<div className="relative">
									<div className="absolute -inset-2 bg-yellow-300 transform rotate-2 rounded-lg opacity-50" />
									<h1 className="relative text-2xl sm:text-3xl lg:text-4xl font-black tracking-wider transform sm:-rotate-1 text-black">
										{appStyle === "manga" ? "STORY→MANGA" : "STORY→COMIC"}
									</h1>
									<div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 text-red-500 font-black text-xs sm:text-sm transform rotate-12">
										AI POWERED!
									</div>
								</div>
							</div>

							<StyleSelector value={appStyle} onChange={setAppStyle} />
						</div>
					</div>
				</div>
			</div>

			{/* Main Manga Layout */}
			<div className="relative z-10 p-4 pt-8">
				<div className="grid lg:grid-cols-2 gap-6">
					{/* Left Panel - Story Creation (Main Panel) */}
					<div className="relative">
						<div className="bg-white border-4 border-black rounded-none relative overflow-hidden shadow-[12px_12px_0px_0px_#000] mb-6">
							<div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500" />

							{/* Panel Title Banner */}
							<div className="bg-black text-white p-3">
								<div className="flex items-center justify-center gap-3">
									<div className="text-yellow-400 text-xl">✨</div>
									<h2 className="text-xl font-black tracking-widest text-white">
										STORY CREATION PANEL
									</h2>
									<div className="text-yellow-400 text-xl">✨</div>
								</div>
							</div>

							<div className="p-6 space-y-6">
								<Hero appStyle={appStyle} />

								{/* Story Input Panel */}
								<div className="border-4 border-dashed border-gray-400 bg-yellow-50 p-4 relative">
									<div className="absolute -top-3 left-4 bg-red-500 text-white px-3 py-1 font-black text-sm transform -rotate-2">
										CHAPTER 1: YOUR STORY
									</div>
									<StoryInput
										value={story}
										onChange={setStory}
										wordCount={wordCount}
										maxWords={500}
										appStyle={appStyle}
									/>
								</div>

								{/* Image Upload Panel */}
								<div className="border-4 border-dashed border-blue-400 bg-blue-50 p-4 relative">
									<div className="absolute -top-3 left-4 bg-blue-500 text-white px-3 py-1 font-black text-sm transform rotate-2">
										REFERENCE IMAGES
									</div>
									<ImageUploader
										characterImages={characterImages}
										settingImages={settingImages}
										onCharacterImagesChange={setCharacterImages}
										onSettingImagesChange={setSettingImages}
										appStyle={appStyle}
									/>
								</div>

								{/* Generation Controls Panel */}
								<div className="border-4 border-dashed border-green-400 bg-green-50 p-4 relative">
									<div className="absolute -top-3 left-4 bg-green-500 text-white px-3 py-1 font-black text-sm">
										ACTION COMMANDS
									</div>
									<GenerationControls
										onGenerate={handleGenerate}
										onClearResults={handleClearResults}
										onClearAll={handleClearAll}
										isGenerating={isGenerating}
										hasStory={!!story.trim()}
										appStyle={appStyle}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Right Panel - Generation Progress */}
					<div className="relative">
						<div className="bg-white border-4 border-black rounded-none relative overflow-hidden shadow-[12px_12px_0px_0px_#000] lg:sticky lg:top-8">
							<div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

							{/* Panel Title Banner */}
							<div className="bg-black text-white p-3">
								<div className="flex items-center justify-center gap-3">
									<div className="text-pink-400 text-xl">⚡</div>
									<h2 className="text-xl font-black tracking-widest text-white">
										MANGA GENERATION
									</h2>
									<div className="text-pink-400 text-xl">⚡</div>
								</div>
							</div>

							<div className="p-6">
								<GenerationProgress
									steps={generationSteps}
									onImageClick={handleImageClick}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Floating Action Effects */}
			{isGenerating && (
				<div className="fixed inset-0 pointer-events-none z-50">
					<div className="absolute top-1/4 left-1/4 text-6xl font-black text-yellow-400 animate-bounce transform rotate-12">
						POW!
					</div>
					<div className="absolute top-1/3 right-1/4 text-4xl font-black text-red-500 animate-pulse transform -rotate-12">
						ZAP!
					</div>
					<div className="absolute bottom-1/3 left-1/3 text-5xl font-black text-blue-500 animate-bounce transform rotate-6">
						BOOM!
					</div>
				</div>
			)}

			{/* Modals */}
			<ImageModal
				isOpen={showImageModal}
				onClose={() => setShowImageModal(false)}
				imageUrl={modalImageUrl}
			/>

			<ErrorModal
				isOpen={showErrorModal}
				onClose={() => setShowErrorModal(false)}
				message={errorMessage}
				appStyle={appStyle}
			/>

			<ConfirmModal
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				onConfirm={confirmAction}
				appStyle={appStyle}
			/>

			<Toaster />
		</div>
	);
}
