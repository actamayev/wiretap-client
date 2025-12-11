"use client"

import { observer } from "mobx-react"
import { useForm } from "react-hook-form"
import { usePathname } from "next/navigation"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"
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
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import GoogleSignIn from "@/components/auth/google/google-sign-in"
import OrComponent from "@/components/auth/or-component"
import ErrorMessage from "@/components/messages/error-message"
import registerSubmit from "@/utils/auth/submit/register-submit"
import { registerSchema } from "@/utils/auth/auth-schemas"
import UsernameInput from "@/components/auth/username-input"
import PasswordField from "@/components/auth/password-input"
import authClass from "@/classes/auth-class"

// eslint-disable-next-line max-lines-per-function
export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">): React.ReactNode {
	const [error, setError] = useState("")
	const pathname = usePathname()

	const form = useForm<IncomingRegisterRequest>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			username: "",
			password: "",
		}
	})

	const onSubmit = useCallback(async (values: IncomingRegisterRequest): Promise<void> => {
		await registerSubmit(values, setError)
	}, [])

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="bg-transparent">
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create your account</CardTitle>
					<CardDescription>
						Enter your information below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
							{error && <ErrorMessage error={error} />}

							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="username">Username</FieldLabel>
									<UsernameInput control={form.control} />
								</Field>

								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<FormField
										control={form.control}
										name="email"
										render={({ field }): React.ReactElement => (
											<FormItem>
												<FormControl>
													<Input
														id="email"
														type="email"
														placeholder="Email"
														{...field}
														maxLength={100}
														required
														className={cn(
															"w-full h-12 rounded-xl text-xl! font-light",
															"border-2 bg-gray-50 shadow-none border-gray-700",
															"focus-visible:ring-0 focus-visible:ring-offset-0",
															"focus:border-gray-700 focus-visible:border-gray-700 active:border-gray-700",
															"text-button-text placeholder:text-button-text"
														)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</Field>

								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<PasswordField control={form.control} name={"password"} />
								</Field>

								<Field>
									<Button type="submit" className="w-full">Create Account</Button>
								</Field>

								<Field>
									<OrComponent />
								</Field>

								<Field>
									<GoogleSignIn />
								</Field>

								<Field>
									<FieldDescription className="text-center">
										Already have an account?{" "}
										{pathname === "/register" ? (
											<Link href="/login" className="underline underline-offset-4 cursor-pointer">
												Login
											</Link>
										) : (
											<button
												type="button"
												onClick={(): void => authClass.setShowLoginOrRegister("Login")}
												className="underline underline-offset-4 cursor-pointer"
											>
												Login
											</button>
										)}
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

export default observer(SignupForm)
