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
import loginSubmit from "@/utils/auth/submit/login-submit"
import { loginSchema } from "@/utils/auth/auth-schemas"
import PasswordField from "@/components/auth/password-input"
import authClass from "@/classes/auth-class"

function renderRegisterLink(pathname: string): React.ReactNode {
	if (pathname === "/login") {
		return (
			<Link href="/register" className="underline underline-offset-4 cursor-pointer">
				Register
			</Link>
		)
	}
	return (
		<button
			type="button"
			onClick={(): void => authClass.setShowLoginOrRegister("Register")}
			className="underline underline-offset-4 font-semibold cursor-pointer"
		>
			Register
		</button>
	)
}

interface LoginFormProps extends React.ComponentProps<"div"> {
	extraClasses?: string
}

function LoginForm({
	className,
	extraClasses,
	...props
}: LoginFormProps): React.ReactNode {
	const [error, setError] = useState("")
	const pathname = usePathname()

	const form = useForm<IncomingLoginRequest>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			contact: "",
			password: ""
		}
	})

	const onSubmit = useCallback(async (values: IncomingLoginRequest): Promise<void> => {
		await loginSubmit(values, setError)
	}, [])

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className={cn("bg-sidebar-blue", extraClasses)}>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Sign in to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
							{error && <ErrorMessage error={error} />}

							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="contact">Email or Username</FieldLabel>
									<FormField
										control={form.control}
										name="contact"
										render={({ field }): React.ReactElement => (
											<FormItem>
												<FormControl>
													<Input
														id="contact"
														type="text"
														placeholder="Email or Username"
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
									<Button type="submit" className="w-full">Login</Button>
								</Field>

								<Field>
									<OrComponent />
								</Field>

								<Field>
									<GoogleSignIn />
								</Field>

								<Field>
									<FieldDescription className="text-center">
										Don&apos;t have an account? {renderRegisterLink(pathname)}
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

export default observer(LoginForm)
