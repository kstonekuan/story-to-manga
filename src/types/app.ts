export type AppStyle = "manga" | "comic";

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
