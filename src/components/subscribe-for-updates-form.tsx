import { useCallback, useMemo, useState } from "react"
import subscribeForUpdates from "../utils/subscribe-for-updates"
import { useForm } from "react-hook-form"
import { emailUpdatesSchema } from "../utils/auth/auth-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import isEmailValid from "../utils/auth/is-email-valid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SubscribeForUpdatesForm(): React.ReactNode {
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = useCallback(async (values: EmailUpdatesRequest): Promise<void> => {
		if (isLoading) return
		await subscribeForUpdates(values, setIsLoading)
	}, [isLoading])

	const form = useForm<EmailUpdatesRequest>({
		resolver: zodResolver(emailUpdatesSchema),
		defaultValues: {
			email: ""
		}
	})

	const formValues = form.watch()
	const isEmailValidMemo = useMemo((): boolean => {
		return isEmailValid(formValues.email) === "Email"
	}, [formValues.email])

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
					disabled={isLoading || !isEmailValidMemo}
					className="bg-white text-black hover:bg-white/90 hover:cursor-pointer duration-0">
					{isLoading ? "Subscribing..." : "Get early access"}
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
