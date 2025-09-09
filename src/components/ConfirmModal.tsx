import { AlertTriangle } from "lucide-react";
import type { AppStyle } from "@/types/app";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	appStyle: AppStyle;
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	appStyle,
}: ConfirmModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<div className="text-center space-y-4">
					<div
						className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
							appStyle === "manga"
								? "bg-orange-100 text-orange-500"
								: "bg-orange-100 text-orange-500"
						}`}
					>
						<AlertTriangle className="w-8 h-8" />
					</div>

					<div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Clear All Saved Data?
						</h3>
						<p className="text-gray-600">
							This will permanently delete your story, uploaded images, and all
							generation results. This action cannot be undone.
						</p>
					</div>

					<div className="flex gap-3">
						<Button onClick={onClose} variant="outline" className="flex-1">
							Cancel
						</Button>
						<Button
							onClick={onConfirm}
							variant="destructive"
							className="flex-1"
						>
							🗑️ Clear All Data
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
