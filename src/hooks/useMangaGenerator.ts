import { useCallback, useEffect, useState } from "react";
import {
	trackError,
	trackEvent,
	trackMangaGeneration,
	trackPerformance,
} from "@/lib/analytics";
import {
	clearAllData,
	getStorageInfo,
	loadState,
	saveState,
} from "@/lib/storage";
import type {
	CharacterReference,
	ComicStyle,
	GeneratedPanel,
	StoryAnalysis,
	StoryBreakdown,
	UploadedCharacterReference,
	UploadedSettingReference,
} from "@/types";

export interface GenerationStep {
	id: string;
	title: string;
	status: "pending" | "in-progress" | "completed" | "error";
	data?: unknown;
	error?: string | undefined;
}

export interface UploadedImage {
	id: string;
	file: File;
	url: string;
	name: string;
	category: "character" | "setting";
}

export function useMangaGenerator() {
	// State
	const [story, setStory] = useState("");
	const [appStyle, setAppStyle] = useState<ComicStyle>("manga");
	const [characterImages, setCharacterImages] = useState<UploadedImage[]>([]);
	const [settingImages, setSettingImages] = useState<UploadedImage[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [currentStepText, setCurrentStepText] = useState("");
	const [currentStepId, setCurrentStepId] = useState<string | null>(null);

	// Generated content state
	const [storyAnalysis, setStoryAnalysis] = useState<StoryAnalysis | null>(
		null,
	);
	const [characterReferences, setCharacterReferences] = useState<
		CharacterReference[]
	>([]);
	const [storyBreakdown, setStoryBreakdown] = useState<StoryBreakdown | null>(
		null,
	);
	const [generatedPanels, setGeneratedPanels] = useState<GeneratedPanel[]>([]);

	// Generation steps for the new UI
	const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
		{ id: "analysis", title: "Story Analysis", status: "pending" },
		{ id: "characters", title: "Character Designs", status: "pending" },
		{ id: "layout", title: "Comic Layout Plan", status: "pending" },
		{ id: "panels", title: "Generated Panels", status: "pending" },
		{ id: "share", title: "Create Shareable Image", status: "pending" },
	]);

	// Storage state
	const [isLoadingState, setIsLoadingState] = useState(true);
	const [isSavingState, setIsSavingState] = useState(false);

	// Error handling
	const handleApiError = async (
		response: Response,
		defaultMessage: string,
	): Promise<string> => {
		if (response.status === 429) {
			try {
				const data = await response.json();
				const retryAfter = data.retryAfter || 60;
				return `Rate limit exceeded. Please wait ${retryAfter} seconds and try again.`;
			} catch {
				return "Rate limit exceeded. Please wait a minute and try again.";
			}
		}

		if (response.status === 400) {
			try {
				const data = await response.json();
				if (data.errorType === "PROHIBITED_CONTENT") {
					return `⚠️ Content Safety Issue: ${data.error}\n\nTip: Try modifying your story to remove potentially inappropriate content, violence, or mature themes.`;
				}
				return data.error || defaultMessage;
			} catch {
				return defaultMessage;
			}
		}

		return defaultMessage;
	};

	const updateStepStatus = useCallback(
		(
			stepId: string,
			status: GenerationStep["status"],
			data?: unknown,
			error?: string | undefined,
		) => {
			setGenerationSteps((prev) =>
				prev.map((step) =>
					step.id === stepId ? { ...step, status, data, error } : step,
				),
			);
		},
		[],
	);

	const wordCount = story
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;

	// Convert uploaded images to the format expected by the API
	const getUploadedCharacterReferences =
		useCallback((): UploadedCharacterReference[] => {
			return characterImages.map((img) => ({
				id: img.id,
				name: img.name,
				image: img.url,
				fileName: img.file.name,
			}));
		}, [characterImages]);

	const getUploadedSettingReferences =
		useCallback((): UploadedSettingReference[] => {
			return settingImages.map((img) => ({
				id: img.id,
				name: img.name,
				image: img.url,
				fileName: img.file.name,
			}));
		}, [settingImages]);

	const generateComic = async () => {
		if (!story.trim()) {
			throw new Error("Please enter a story before generating.");
		}

		if (wordCount > 500) {
			throw new Error("Story must be 500 words or less.");
		}

		const generationStartTime = Date.now();
		trackEvent({
			action: "start_generation",
			category: "manga_generation",
			label: appStyle,
			value: wordCount,
		});

		setIsGenerating(true);
		setCurrentStepText("Analyzing your story...");
		setCurrentStepId("analysis");

		// Reset all steps
		setGenerationSteps((steps) =>
			steps.map((step) => ({
				...step,
				status: "pending" as const,
				data: undefined,
				error: undefined,
			})),
		);

		try {
			// Step 1: Analyze story
			updateStepStatus("analysis", "in-progress");
			const analysisResponse = await fetch("/api/analyze-story", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ story, style: appStyle }),
			});

			if (!analysisResponse.ok) {
				throw new Error(
					await handleApiError(analysisResponse, "Failed to analyze story"),
				);
			}

			const { analysis } = await analysisResponse.json();
			setStoryAnalysis(analysis);
			updateStepStatus("analysis", "completed", analysis);

			// Step 2: Generate character references
			setCurrentStepText("Creating character designs...");
			setCurrentStepId("characters");
			updateStepStatus("characters", "in-progress");

			const charRefResponse = await fetch("/api/generate-character-refs", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					characters: analysis.characters,
					setting: analysis.setting,
					style: appStyle,
					uploadedCharacterReferences: getUploadedCharacterReferences(),
				}),
			});

			if (!charRefResponse.ok) {
				throw new Error(
					await handleApiError(
						charRefResponse,
						"Failed to generate character references",
					),
				);
			}

			const { characterReferences: charRefs } = await charRefResponse.json();
			setCharacterReferences(charRefs);
			updateStepStatus("characters", "completed", {
				designs: charRefs.map((char: CharacterReference) => ({
					name: char.name,
					url: char.image,
				})),
			});

			// Step 3: Break down story into panels
			setCurrentStepText("Planning comic layout...");
			setCurrentStepId("layout");
			updateStepStatus("layout", "in-progress");

			const storyBreakdownResponse = await fetch("/api/chunk-story", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					story,
					characters: analysis.characters,
					setting: analysis.setting,
					style: appStyle,
				}),
			});

			if (!storyBreakdownResponse.ok) {
				throw new Error(
					await handleApiError(
						storyBreakdownResponse,
						"Failed to break down story",
					),
				);
			}

			const { storyBreakdown: breakdown } = await storyBreakdownResponse.json();
			setStoryBreakdown(breakdown);
			updateStepStatus("layout", "completed", { panels: breakdown.panels });

			// Step 4: Generate comic panels
			setCurrentStepId("panels");
			updateStepStatus("panels", "in-progress");
			const panels: GeneratedPanel[] = [];

			for (let i = 0; i < breakdown.panels.length; i++) {
				const panel = breakdown.panels[i];
				setCurrentStepText(
					`Generating panel ${i + 1}/${breakdown.panels.length}...`,
				);

				const panelResponse = await fetch("/api/generate-panel", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						panel,
						characterReferences: charRefs,
						setting: analysis.setting,
						style: appStyle,
						uploadedSettingReferences: getUploadedSettingReferences(),
					}),
				});

				if (!panelResponse.ok) {
					const errorMessage = await handleApiError(
						panelResponse,
						`Failed to generate panel ${i + 1}`,
					);
					trackError(
						"panel_generation_failed",
						`Panel ${i + 1}: ${errorMessage}`,
					);
					throw new Error(errorMessage);
				}

				const { generatedPanel } = await panelResponse.json();
				panels.push(generatedPanel);
				setGeneratedPanels([...panels]);

				if (i === 0) {
					const timeToFirstPanel = Date.now() - generationStartTime;
					trackPerformance("time_to_first_panel", timeToFirstPanel);
				}
			}

			updateStepStatus("panels", "completed", {
				panels: panels.map((p) => ({
					id: p.panelNumber.toString(),
					url: p.image,
				})),
			});

			// Step 5: Enable share functionality
			setCurrentStepId("share");
			updateStepStatus("share", "completed", { available: true });

			setCurrentStepText("Complete! 🎉");
			setIsGenerating(false);
			setCurrentStepId(null);

			// Track successful generation
			const generationTime = Date.now() - generationStartTime;
			trackMangaGeneration(wordCount, panels.length);
			trackPerformance("total_generation_time", generationTime);
		} catch (error) {
			console.error("Generation error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Generation failed";

			setIsGenerating(false);
			setCurrentStepId(null);
			trackError("generation_failed", errorMessage);

			// Update the step that was currently in progress with error
			if (currentStepId) {
				updateStepStatus(currentStepId, "error", undefined, errorMessage);
			} else {
				// Fallback: if no currentStepId, find the step that's in-progress and mark it as error
				setGenerationSteps((prev) => {
					const inProgressStep = prev.find(
						(step) => step.status === "in-progress",
					);
					if (inProgressStep) {
						return prev.map((step) =>
							step.id === inProgressStep.id
								? { ...step, status: "error" as const, error: errorMessage }
								: step,
						);
					}
					return prev;
				});
			}

			throw error;
		}
	};

	// Load state on component mount
	useEffect(() => {
		const initializeApp = async () => {
			try {
				const savedState = await loadState();
				if (savedState) {
					setStory(savedState.story);
					setAppStyle(savedState.style);
					setStoryAnalysis(savedState.storyAnalysis);
					setCharacterReferences(savedState.characterReferences);
					setStoryBreakdown(savedState.storyBreakdown);
					setGeneratedPanels(savedState.generatedPanels);

					// Update steps based on saved state
					if (savedState.storyAnalysis) {
						updateStepStatus("analysis", "completed", savedState.storyAnalysis);
					}
					if (savedState.characterReferences.length > 0) {
						updateStepStatus("characters", "completed", {
							designs: savedState.characterReferences.map(
								(char: { name: string; image: string }) => ({
									name: char.name,
									url: char.image,
								}),
							),
						});
					}
					if (savedState.storyBreakdown) {
						updateStepStatus("layout", "completed", {
							panels: savedState.storyBreakdown.panels,
						});
					}
					if (savedState.generatedPanels.length > 0) {
						updateStepStatus("panels", "completed", {
							panels: savedState.generatedPanels.map((p) => ({
								id: p.panelNumber.toString(),
								url: p.image,
							})),
						});
						updateStepStatus("share", "completed", { available: true });
					}
				}
			} catch (error) {
				console.error("Failed to load saved state:", error);
			} finally {
				setIsLoadingState(false);
			}
		};

		initializeApp();
	}, [updateStepStatus]);

	// Save state whenever important data changes
	useEffect(() => {
		if (isLoadingState) return; // Don't save while still loading

		const saveCurrentState = async () => {
			try {
				setIsSavingState(true);
				await saveState(
					story,
					appStyle,
					storyAnalysis,
					storyBreakdown,
					characterReferences,
					generatedPanels,
					getUploadedCharacterReferences(),
					getUploadedSettingReferences(),
				);
			} catch (error) {
				console.error("Failed to save state:", error);
			} finally {
				setIsSavingState(false);
			}
		};

		// Only save if we have some meaningful content
		if (
			story.trim() ||
			storyAnalysis ||
			characterReferences.length > 0 ||
			generatedPanels.length > 0 ||
			characterImages.length > 0 ||
			settingImages.length > 0
		) {
			saveCurrentState();
		}
	}, [
		story,
		appStyle,
		storyAnalysis,
		storyBreakdown,
		characterReferences,
		generatedPanels,
		characterImages,
		settingImages,
		isLoadingState,
		getUploadedCharacterReferences,
		getUploadedSettingReferences,
	]);

	const clearResults = () => {
		// Clear only generated content, keep story and settings intact
		setStoryAnalysis(null);
		setCharacterReferences([]);
		setStoryBreakdown(null);
		setGeneratedPanels([]);
		setGenerationSteps((steps) =>
			steps.map((step) => ({
				...step,
				status: "pending" as const,
				data: undefined,
				error: undefined,
			})),
		);
		setCurrentStepId(null);
	};

	const clearAllGeneratedData = async () => {
		try {
			await clearAllData();
			setStory("");
			setAppStyle("manga");
			setStoryAnalysis(null);
			setCharacterReferences([]);
			setStoryBreakdown(null);
			setGeneratedPanels([]);
			setCharacterImages([]);
			setSettingImages([]);
			setGenerationSteps((steps) =>
				steps.map((step) => ({
					...step,
					status: "pending" as const,
					data: undefined,
					error: undefined,
				})),
			);
			setCurrentStepId(null);
		} catch (error) {
			console.error("Failed to clear data:", error);
			throw error;
		}
	};

	return {
		// State
		story,
		setStory,
		appStyle,
		setAppStyle,
		characterImages,
		setCharacterImages,
		settingImages,
		setSettingImages,
		isGenerating,
		currentStepText,
		generationSteps,
		wordCount,
		isLoadingState,
		isSavingState,

		// Generated content
		storyAnalysis,
		characterReferences,
		storyBreakdown,
		generatedPanels,

		// Actions
		generateComic,
		clearResults,
		clearAllGeneratedData,
		updateStepStatus,

		// Storage info
		storageInfo: getStorageInfo(),
	};
}
