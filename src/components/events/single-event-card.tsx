"use client"

import Image from "next/image"
import { observer } from "mobx-react"
import { useCallback } from "react"
import { Button } from "../ui/button"
import SimpleChart from "../simple-chart"
import { formatVolume } from "../../utils/format"
import tradeClass from "../../classes/trade-class"
import useTypedNavigate from "../../hooks/navigate/use-typed-navigate"

interface SingleEventCardProps {
	event: SingleEvent
}

function SingleEventCard({ event }: SingleEventCardProps): React.ReactNode {
	const navigate = useTypedNavigate()

	const handleTitleClick = useCallback((): void => {
		navigate(`/events/${event.eventSlug}`)
	}, [navigate, event.eventSlug])

	const handleYesClick = useCallback((): void => {
		const market = event.eventMarkets[0]
		tradeClass.setSelectedMarket("Yes" as OutcomeString)
		tradeClass.setMarketId(market.marketId)
		tradeClass.setSelectedClobToken(market.outcomes[0].clobTokenId)
		navigate(`/events/${event.eventSlug}`)
	}, [navigate, event.eventSlug, event.eventMarkets])

	const handleNoClick = useCallback((): void => {
		const market = event.eventMarkets[0]
		tradeClass.setSelectedMarket("No" as OutcomeString)
		tradeClass.setMarketId(market.marketId)
		tradeClass.setSelectedClobToken(market.outcomes[1].clobTokenId)
		navigate(`/events/${event.eventSlug}`)
	}, [navigate, event.eventSlug, event.eventMarkets])

	return (
		<div className="rounded-lg p-4 hover:shadow-md transition-shadow bg-sidebar-blue aspect-615/175 flex flex-col">
			<div className="flex gap-8 w-full flex-1 min-h-0">
				{/* Left Section - 3/5 width */}
				<div className="w-3/5 flex flex-col gap-3 h-full">
					{/* Row 1: Image, Name, Percentage */}
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted">
							<Image
								src={event.eventImageUrl}
								alt={event.eventTitle}
								width={48}
								height={48}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1 min-w-0">
							<h3
								onClick={handleTitleClick}
								className="font-semibold text-lg line-clamp-2 cursor-pointer hover:underline"
							>
								{event.eventTitle}
							</h3>
						</div>
						<div className="shrink-0 text-xl font-bold text-yes-green">
							{Math.round((event.eventMarkets[0].bestAsk ?? 0) * 100)}%
						</div>
					</div>

					{/* Row 2: Yes/No Buttons */}
					<div className="flex gap-4">
						<Button
							variant="default"
							size="sm"
							className="flex-1 bg-yes-green hover:bg-yes-green-hover rounded-[5px] text-button-text text-lg h-10"
							onClick={handleYesClick}
						>
							Yes
						</Button>
						<Button
							variant="default"
							size="sm"
							className="flex-1 bg-no-red hover:bg-no-red-hover rounded-[5px] text-button-text text-lg h-10"
							onClick={handleNoClick}
						>
							No
						</Button>
					</div>

					{/* Row 3: Volume */}
					<div className="text-sm text-volume-text">
						{formatVolume(event.eventTotalVolume)}
					</div>
				</div>

				{/* Right Section - 2/5 width */}
				<div className="w-2/5 flex flex-col h-full min-h-0">
					<div className="flex-1 min-h-0 rounded-[5px] overflow-hidden">
						<SimpleChart seed={event.eventSlug} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default observer(SingleEventCard)
