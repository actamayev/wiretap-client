"use client"

import Link from "next/link"
import { observer } from "mobx-react"
import { useForm } from "react-hook-form"
import { useCallback, useState } from "react"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import GoogleSignIn from "../google/google-sign-in"
import OrComponent from "../or-component"
import ErrorMessage from "../../messages/error-message"
import registerSubmit from "../../../utils/auth/submit/register-submit"
import { registerSchema } from "../../../utils/auth/auth-schemas"
import { PageToNavigateAfterLogin } from "../../../utils/constants/page-constants"
import useTypedNavigate from "../../../hooks/navigate/use-typed-navigate"
import { usePathname } from "next/navigation"
import UsernameInput from "../username-input"
import PasswordField from "../password-input"
import { zodResolver } from "@hookform/resolvers/zod"
import authClass from "../../../classes/auth-class"
import AuthTemplate from "../auth-template"
import { Button } from "@/components/ui/button"
import { cn } from "../../../lib/utils"

function RegisterComponent(): React.ReactNode {
	const [error, setError] = useState("")
	const navigate = useTypedNavigate()
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
		const success = await registerSubmit(values, setError)
		if (success === false || pathname !== "/register") return
		navigate(PageToNavigateAfterLogin)
	}, [navigate, pathname])


	return (
		<AuthTemplate>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
					<div className="flex flex-col items-center text-center">
						<h1 className="text-2xl font-bold">Create your account</h1>
					</div>

					{error && <ErrorMessage error={error} />}

					<UsernameInput control={form.control} />

					<div className="grid gap-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }): React.ReactElement => {
								return (
									<FormItem>
										<FormControl>
											<Input
												id="email"
												type="email"
												placeholder="Email"
												{...field}
												maxLength={100}
												required
												// eslint-disable-next-line max-len
												className={cn("w-full h-12 rounded-xl text-xl! font-light border-2 bg-gray-50 shadow-none border-gray-700",
													"focus-visible:ring-0 focus-visible:ring-offset-0")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)
							}}
						/>
					</div>

					<PasswordField control={form.control} name={"password"} />

					<Button className="bg-gray-700 text-white hover:bg-gray-600 cursor-pointer duration-0">
						Create Account
					</Button>

					<OrComponent />

					<GoogleSignIn />

					<div className="text-center text-sm">
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
					</div>
				</form>
			</Form>
		</AuthTemplate>
	)
}

export default observer(RegisterComponent)
