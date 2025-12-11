"use client"

import { useForm } from "react-hook-form"
import { useCallback, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import useTypedNavigate from "@/hooks/navigate/use-typed-navigate"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { registerUsernameSchema } from "@/utils/auth/auth-schemas"
import registerGoogleInfo from "@/utils/auth/google/register-google-info"
import ErrorMessage from "@/components/messages/error-message"
import { handleTypeUsername } from "@/utils/handle-type-validation/handle-type-fields"
import CharacterCounter from "@/components/character-counter"

export function GoogleUsernameForm({
	className,
	...props
}: React.ComponentProps<"div">): React.ReactNode {
	const [error, setError] = useState("")
	const navigate = useTypedNavigate()

	const form = useForm<NewGoogleInfoFormValues>({
		resolver: zodResolver(registerUsernameSchema),
		defaultValues: {
			username: "",
		}
	})

	const onSubmit = useCallback(async (values: NewGoogleInfoFormValues): Promise<void> => {
		const success = await registerGoogleInfo(values, setError)
		if (success === false) return
		// On success, navigate to home page
		navigate("/")
	}, [navigate])

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Choose your username</CardTitle>
					<CardDescription>
						Complete your account setup by choosing a username
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="username">Username</FieldLabel>
									<FormField
										control={form.control}
										name="username"
										render={({ field }): React.ReactElement => (
											<FormItem>
												<FormControl>
													<div className="relative">
														<Input
															id="username"
															placeholder="username"
															{...field}
															value={field.value?.toString() || ""}
															onChange={(event): void => {
																const sanitizedValue = handleTypeUsername(event)
																field.onChange(sanitizedValue)
															}}
															className={cn(
																"w-full pr-16 truncate h-12 rounded-xl text-xl!",
																"font-light border-2 bg-gray-50 shadow-none border-gray-700",
																"focus-visible:ring-0 focus-visible:ring-offset-0",
																"text-button-text placeholder:text-button-text"
															)}
															maxLength={100}
															required
														/>
														<CharacterCounter
															value={field.value?.toString() || ""}
															characterLimit={100}
															extraClasses="right-3"
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</Field>
								{error && (
									<Field>
										<ErrorMessage error={error} />
									</Field>
								)}
								<Field>
									<Button type="submit">Continue</Button>
									<FieldDescription>
										Choose a username that&apos;s at least 3 characters long.
									</FieldDescription>
								</Field>
							</FieldGroup>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
