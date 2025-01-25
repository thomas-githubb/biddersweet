"use client"

import * as React from "react"
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Timer, DollarSign, Eye, Heart } from "lucide-react"
import { useEffect } from "react"

interface TrendingItem {
  id: number
  name: string
  currentBid: number
  endTime: string
  image: string
  bids: number
  watchers: number
}

interface TrendingCarouselProps {
  items: TrendingItem[]
}

export function TrendingCarousel({ items }: TrendingCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    dragFree: true,
    containScroll: 'trimSnaps'
  })

  useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 3000) // Scroll every 3 seconds

    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {items.map((item) => (
          <div key={item.id} className="flex-[0_0_90%] min-w-0 pl-4 md:flex-[0_0_45%] lg:flex-[0_0_30%]">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-900/20 to-gray-900/20 border-purple-900/20">
              <div className="relative h-48 bg-gradient-to-br from-purple-500/10 to-gray-500/10">
                {/* Replace with actual images */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="backdrop-blur-sm bg-black/50 text-white">
                    <Timer className="w-4 h-4 mr-1" />
                    {item.endTime}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-purple-100">{item.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center text-purple-400">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-bold">{item.currentBid.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {item.watchers}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {item.bids}
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Place Bid</Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
} 