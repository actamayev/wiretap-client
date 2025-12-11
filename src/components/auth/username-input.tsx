"use client"

import { Control, FieldPath } from "react-hook-form"
import { Input } from "../ui/input"
import CharacterCounter from "../character-counter"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { handleTypeUsername } from "../../utils/handle-type-validation/handle-type-fields"
import { cn } from "../../lib/utils"

// Base interface for any form that has a username field
interface FormWithUsername {
	username: string
}

interface Props<T extends FormWithUsername> {
	control: Control<T>
}

export default function UsernameInput<T extends FormWithUsername>({
	control,
}: Props<T>): React.ReactNode {
	return (
		<FormField
			control={control}
			name={"username" as FieldPath<T>}
			render={({ field }): React.ReactElement => (
				<FormItem className="grid gap-2">
					<FormControl>
						<div className="relative">
							<Input
								placeholder="Username"
								{...field}
								value={field.value?.toString() || ""}
								onChange={(event): void => {
									const sanitizedValue = handleTypeUsername(event)
									field.onChange(sanitizedValue)
								}}
								className={cn("w-full pr-16 truncate h-12 rounded-xl text-xl!",
									"font-light border-2 bg-gray-50 shadow-none border-gray-700 focus-visible:ring-0",
									"focus-visible:ring-offset-0",
									"focus:border-gray-700 focus-visible:border-gray-700 active:border-gray-700",
									"text-button-text placeholder:text-button-text")}
								maxLength={100}
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
	)
}
