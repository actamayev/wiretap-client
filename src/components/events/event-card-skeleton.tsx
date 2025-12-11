"use client"

import { Skeleton } from "../ui/skeleton"

function EventCardSkeleton(): React.ReactNode {
	return (
		<div className="rounded-lg p-4 bg-sidebar-blue aspect-615/175 flex flex-col border border-white/40">
			<div className="flex gap-8 w-full flex-1 min-h-0">
				{/* Left Section - 3/5 width */}
				<div className="w-3/5 flex flex-col gap-3 h-full">
					{/* Row 1: Image, Name, Percentage */}
					<div className="flex items-center gap-3">
						<Skeleton className="w-12 h-12 shrink-0 rounded-md" />
						<div className="flex-1 min-w-0">
							<Skeleton className="h-5 w-full mb-1" />
							<Skeleton className="h-5 w-3/4" />
						</div>
						<Skeleton className="shrink-0 w-12 h-6" />
					</div>

					{/* Row 2: Yes/No Buttons */}
					<div className="flex gap-4">
						<Skeleton className="flex-1 h-10 rounded-[5px]" />
						<Skeleton className="flex-1 h-10 rounded-[5px]" />
					</div>

					{/* Row 3: Volume */}
					<Skeleton className="h-4 w-20" />
				</div>

				{/* Right Section - 2/5 width */}
				<div className="w-2/5 flex flex-col h-full min-h-0">
					<div className="flex-1 min-h-0 rounded-[5px] overflow-hidden">
						<Skeleton className="w-full h-full" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default EventCardSkeleton
