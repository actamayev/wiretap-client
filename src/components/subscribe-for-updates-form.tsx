import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import subscribeForUpdates from "../utils/subscribe-for-updates"
import { useForm } from "react-hook-form"
import { emailUpdatesSchema } from "../utils/auth/auth-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import isEmailValid from "../utils/auth/is-email-valid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SubscribeForUpdatesForm(): React.ReactNode {
	const [isLoading, setIsLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const successfulEmailRef = useRef<string>("")

	const onSubmit = useCallback(async (values: EmailUpdatesRequest): Promise<void> => {
		if (isLoading) return
		const successResponse = await subscribeForUpdates(values, setIsLoading)
		if (successResponse) {
			setSuccess(true)
			successfulEmailRef.current = values.email
		} else {
			setSuccess(false)
		}
	}, [isLoading])

	const form = useForm<EmailUpdatesRequest>({
		resolver: zodResolver(emailUpdatesSchema),
		defaultValues: {
			email: ""
		}
	})

	const formValues = form.watch()

	// Clear success state when user starts typing
	useEffect((): void => {
		if (!success || formValues.email === successfulEmailRef.current) return
		setSuccess(false)
	}, [formValues.email, success])

	const isEmailValidMemo = useMemo((): boolean => {
		return isEmailValid(formValues.email) === "Email"
	}, [formValues.email])

	const buttonText = useMemo((): string => {
		if (isLoading) return "Subscribing..."
		if (success) return "Subscribed!"
		return "Get early access"
	}, [isLoading, success])

	return (
		<div className="text-white">
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
				<Input
					{...form.register("email")}
					type="email"
					placeholder="Enter your email"
					disabled={isLoading}
				/>
				<Button
					type="submit"
					disabled={isLoading || !isEmailValidMemo || success}
					className="bg-white text-black hover:bg-white/90 hover:cursor-pointer duration-0">
					{buttonText}
				</Button>
			</form>
			{form.formState.errors.email && (
				<p className="text-red-500 text-sm mt-1">
					{form.formState.errors.email.message}
				</p>
			)}
		</div>
	)
}
