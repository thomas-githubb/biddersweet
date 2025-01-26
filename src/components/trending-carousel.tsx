"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timer, DollarSign, Eye, Heart } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { AnimatedPrice } from "@/components/ui/animated-price";
import { AnimatedHeart } from "@/components/ui/animated-heart";

interface TrendingItem {
  id: number;
  name: string;
  currentBid: number;
  endTime: string;
  image: string;
  bids: number;
  watchers: number;
}

interface TrendingCarouselProps {
  items: TrendingItem[];
}

export function TrendingCarousel({
  items: initialItems,
}: TrendingCarouselProps) {
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      ...item,
      isLiked: false,
      watchers: item.watchers,
      bids: item.bids,
      currentBid: item.currentBid,
    }))
  );

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true,
  });

  // Track hover state
  const [isHovered, setIsHovered] = useState(false);

  // Handle likes
  const toggleLike = (itemId: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isLiked: !item.isLiked,
              bids: item.isLiked ? item.bids - 1 : item.bids + 1,
            }
          : item
      )
    );
  };

  // Randomly increase views and bids over time - more frequent for trending
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((currentItems) =>
        currentItems.map((item) => {
          const newWatchers = item.watchers + (Math.random() > 0.6 ? 1 : 0); // More frequent watcher increases
          const shouldIncreaseBid = Math.random() > 0.85; // 15% chance of new bid (up from 5%)
          const bidIncrement = Math.floor(
            item.currentBid * (0.01 + Math.random() * 0.02)
          ); // 1-3% increase

          return {
            ...item,
            watchers: newWatchers,
            currentBid: shouldIncreaseBid
              ? item.currentBid + bidIncrement
              : item.currentBid,
            bids: shouldIncreaseBid ? item.bids + 1 : item.bids,
          };
        })
      );
    }, 1000); // Update every second instead of every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Modified autoplay with speed control
  const autoplay = useCallback(() => {
    if (emblaApi) {
      const engine = emblaApi.internalEngine();
      // Slower speed when hovered (-0.3 vs -0.88)
      const speed = isHovered ? -0.3 : -0.88;
      engine.location.add(speed);
      engine.target.set(engine.location.get());
      engine.scrollLooper.loop(engine.location.get());
      engine.translate.to(engine.location.get());
    }
  }, [emblaApi, isHovered]);

  useEffect(() => {
    if (!emblaApi) return;

    const play = () => {
      const intervalId = setInterval(autoplay, 16);
      return intervalId;
    };

    let intervalId = play();

    const element = emblaApi.rootNode();
    element.addEventListener("mouseenter", () => setIsHovered(true));
    element.addEventListener("mouseleave", () => setIsHovered(false));

    return () => {
      clearInterval(intervalId);
      element.removeEventListener("mouseenter", () => setIsHovered(true));
      element.removeEventListener("mouseleave", () => setIsHovered(false));
    };
  }, [emblaApi, autoplay]);

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div
        className="overflow-hidden transition-all duration-300"
        ref={emblaRef}
      >
        <div className="flex">
          {[...items, ...items].map((item, index) => {
            const timeLeft = useCountdown(item.endTime);

            return (
              <div
                key={`${item.id}-${index}`}
                className="flex-[0_0_90%] min-w-0 pl-4 md:flex-[0_0_45%] lg:flex-[0_0_30%]"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-900/20 to-gray-900/20 border-purple-900/20 hover:border-purple-500/30">
                  {/* Image Section */}
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="backdrop-blur-sm bg-black/50 text-white"
                      >
                        <Timer className="w-4 h-4 mr-1" />
                        {timeLeft}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-purple-100 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex justify-between items-center mb-3">
                      <AnimatedPrice
                        value={item.currentBid}
                        className="text-purple-400"
                      />
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {Math.floor(item.watchers)}
                        </span>
                        <AnimatedHeart
                          isLiked={item.isLiked}
                          onClick={() => toggleLike(item.id)}
                          count={item.bids}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20"
                      asChild
                    >
                      <a
                        href={`/placebid?id=${
                          item.id
                        }&name=${encodeURIComponent(item.name)}&currentBid=${
                          item.currentBid
                        }&image=${encodeURIComponent(
                          item.image
                        )}&endTime=${encodeURIComponent(
                          item.endTime
                        )}&watchers=${item.watchers}&bids=${item.bids}`}
                      >
                        Place Bid
                      </a>
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
