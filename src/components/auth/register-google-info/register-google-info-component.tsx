"use client"

import { useForm } from "react-hook-form"
import { useCallback, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "../../ui/form"
import UsernameInput from "../username-input"
import ErrorMessage from "../../messages/error-message"
import { registerUsernameSchema } from "../../../utils/auth/auth-schemas"
import registerGoogleInfo from "../../../utils/auth/google/register-google-info"
import { Button } from "@/components/ui/button"

export default function RegisterGoogleInfoComponent(): React.ReactNode {
	const [error, setError] = useState("")

	const form = useForm<NewGoogleInfoFormValues>({
		resolver: zodResolver(registerUsernameSchema),
		defaultValues: {
			username: "",
		}
	})

	const onSubmit = useCallback(async (values: NewGoogleInfoFormValues): Promise<void> => {
		await registerGoogleInfo(values, setError)
		// User stays on current page after successful registration
	}, [])

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-sm md:max-w-md">
						<div className="flex flex-col items-center text-center mb-6">
							<h1 className="text-2xl font-bold">Choose your username</h1>
						</div>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
								<UsernameInput control={form.control} />

								<Button className="bg-gray-700 text-white hover:bg-gray-600 cursor-pointer duration-0">
									Continue
								</Button>

								{error && <ErrorMessage error={error} />}
							</form>
						</Form>
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<Image
					src="/favicon.svg"
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover brightness-[0.2] grayscale"
					fill
					priority
				/>
			</div>
		</div>
	)
}
