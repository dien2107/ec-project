import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import CardReview from "./card-review";

export default function TabsReview() {
  return (
    <div className="mt-6">
      <Tabs defaultValue="all-stars">
        <TabsList className="bg-transparent gap-1">
          <TabsTrigger
            value="all-stars"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            Tất cả (156)
          </TabsTrigger>
          <TabsTrigger
            value="five-star"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            5 sao (142)
          </TabsTrigger>
          <TabsTrigger
            value="four-star"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            4 sao (2)
          </TabsTrigger>
          <TabsTrigger
            value="three-star"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            3 sao (0)
          </TabsTrigger>
          <TabsTrigger
            value="two-star"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            2 sao (0)
          </TabsTrigger>
          <TabsTrigger
            value="one-star"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            1 sao (0)
          </TabsTrigger>
          <TabsTrigger
            value="has-images"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            Có hình ảnh (0)
          </TabsTrigger>
        </TabsList>
        <span className="border-b border-gray-200 mb-6"></span>
        <TabsContent value="all-stars">
          <h3 className="font-medium mb-4">Tất cả đánh giá (156)</h3>
          <CardReview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
