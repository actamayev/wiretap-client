import { Button } from "../../ui/button"
import { observer } from "mobx-react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose
} from "../../ui/dialog"
import fundsClass from "../../../classes/funds-class"
import { Input } from "../../ui/input"
import { handleTypeNumber } from "../../../utils/handle-type-validation/handle-type-fields"
import createFund from "../../../utils/funds/create-fund"

function CreateFundsDialog(): React.ReactNode {
	return (
		<Dialog open={fundsClass.isCreateFundDialogOpen} onOpenChange={fundsClass.setIsCreateFundDialogOpen}>
			<DialogContent className="w-96 border-none" onClick={(e): void => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle className="text-2xl">Create Fund</DialogTitle>
					<DialogClose />
				</DialogHeader>
				<Input
					id="fundName"
					value={fundsClass.createFundData?.fundName}
					onChange={(e): void => fundsClass.setCreateFundKey("fundName", e.target.value)}
					placeholder="Fund name"
					className="w-full text-xl! h-10"
					maxLength={50}
				/>
				<Input
					type="number"
					inputMode="numeric"
					placeholder="Starting account balance (USD)"
					value={fundsClass.createFundData?.startingAccountBalanceUsd?.toString() || ""}
					onChange={(e): void => {
						const sanitizedValue = handleTypeNumber(e)
						fundsClass.setCreateFundKey("startingAccountBalanceUsd", Number(sanitizedValue))
					}}
					className="w-full h-12 rounded-xl text-xl! font-light border-2 bg-polar shadow-none border-swan"
					maxLength={3}
				/>
				<DialogFooter className="flex justify-end gap-2">
					<Button
						onClick={(): void => fundsClass.setIsCreateFundDialogOpen(false)}
						className="flex-1 h-10 rounded-xl text-lg text-white bg-eel dark:bg-swan"
					>
						CANCEL
					</Button>
					<Button
						onClick={(): void => void createFund()}
						className="flex-1 h-10 rounded-xl text-lg text-white bg-eel dark:bg-swan">
						CREATE
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog >
	)
}

export default observer(CreateFundsDialog)
