import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Awards() {
  return (
    <section className="bg-[#f6eee5]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Awards Text */}
          <div className="space-y-8">
            {/* GA Dessert Wars */}
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

            {/* Nationwide */}
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

          {/* Right: Instagram Grid */}
          <div>
            <h3 className="text-lg font-semibold text-[#8F4B2B] mb-4">
              Follow our journey on Instagram
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Top row */}
              {Array.from({ length: 4 }, (_, i) => (
                <Card key={i} className="aspect-square overflow-hidden border-2 border-[#E6D7CB] hover:border-[#8F4B2B] transition-colors">
                  <CardContent className="p-0 h-full">
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="w-full h-full p-0 rounded-none hover:bg-[#8F4B2B]/5"
                    >
                      <Link href="https://instagram.com/bliss-b" target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center justify-center h-full bg-white">
                          <span className="text-[#8F4B2B] opacity-50 text-sm">foto</span>
                        </div>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-4 text-center">
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
      </div>
    </section>
  );
}