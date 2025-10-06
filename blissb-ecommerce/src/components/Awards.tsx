import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Awards() {
  return (
    <section className="bg-[#f6eee5]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:py-10">
        <div className="space-y-12">
          {/* 2024 Awards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: 2024 Text */}
            <div>
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#8F4B2B] mb-2">
                    Top 5 GA Dessert Wars
                  </h2>
                  <div className="text-6xl md:text-8xl font-bold text-[#EFC596] mb-3 leading-none">
                    2024
                  </div>
                  <p className="text-[#6E5B4E] text-sm md:text-base">
                    Recognized among the top five desserts in Georgia's biggest sweet competition.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right: 2024 Images */}
            <div className="grid grid-cols-3 gap-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/img/Premio/premio.JPG"
                  alt="2024 Award 1"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/img/Premio/premio2.jpg"
                  alt="2024 Award 2"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* 2023 Awards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: 2023 Text */}
            <div>
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#8F4B2B] mb-2">
                    Top 20 Nationwide
                  </h2>
                  <div className="text-6xl md:text-8xl font-bold text-[#EFC596] mb-3 leading-none">
                    2023
                  </div>
                  <p className="text-[#6E5B4E] text-sm md:text-base">
                    Ranked among the top 20 desserts across the country for taste and creativity.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right: 2023 Images */}
            <div className="grid grid-cols-3 gap-4">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/img/Premio/premio3.JPG"
                  alt="2023 Award 1"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/img/Premio/premio5.jpg"
                  alt="2023 Award 2"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Instagram Button */}
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="border-[#8F4B2B] text-[#8F4B2B] hover:bg-[#8F4B2B] hover:text-white">
              <Link
                href="https://instagram.com/bliss-b"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
                @bliss-b
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}