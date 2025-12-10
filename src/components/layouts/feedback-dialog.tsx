"use client"

import { useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "../ui/dialog"
import sendFeedback from "../../utils/misc/send-feedback"
import { cn } from "../../lib/utils"

interface FeedbackDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps): React.ReactNode {
	const [feedbackText, setFeedbackText] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleSend = async (): Promise<void> => {
		const success = await sendFeedback(feedbackText, setIsLoading)
		if (success) {
			onOpenChange(false)
			setFeedbackText("")
		}
	}

	const handleCancel = (): void => {
		onOpenChange(false)
		setFeedbackText("")
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl border-none" onClick={(e): void => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle className="text-2xl">Feedback</DialogTitle>
					<DialogClose />
				</DialogHeader>
				<Textarea
					value={feedbackText}
					onChange={(e): void => setFeedbackText(e.target.value)}
					placeholder="Share your feedback..."
					className="w-full min-h-32 active:ring-0! active:ring-offset-0! focus-visible:ring-0! focus-visible:ring-offset-0!"
					maxLength={1000}
				/>
				<DialogFooter className="flex justify-end gap-2">
					<Button
						onClick={handleCancel}
						className={cn(
							"flex-1 h-10 rounded-xl text-lg",
							"border-input bg-transparent dark:bg-input/30 dark:hover:bg-input/50",
							"border shadow-xs transition-[color,box-shadow]",
							"focus-visible:ring-0 focus-visible:ring-offset-0 text-button-text"
						)}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSend}
						disabled={isLoading || !feedbackText.trim()}
						className={cn(
							"flex-1 h-10 rounded-xl text-lg",
							"border-input bg-transparent dark:bg-input/30 dark:hover:bg-input/50",
							"border shadow-xs transition-[color,box-shadow]",
							"focus-visible:ring-0 focus-visible:ring-offset-0 text-button-text",
							"dark:bg-swan disabled:opacity-50 disabled:cursor-not-allowed"
						)}
					>
						Send
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

