// import Header from "@/components/header";

import { FilterMenu } from "@/components/FilterMenu"

export default function Home() {
  const filters = [
    {
      name: "Availability",
      options: ["In Stock", "Out of Stock"],
    },
    {
      name: "GPU",
      options: ["NVIDIA", "AMD", "Intel"],
    },
    {
      name: "Location",
      options: ["USA", "Europe", "Asia"],
    },
    {
      name: "Demand",
      options: ["High", "Medium", "Low"],
    },
    {
      name: "GPU Resources",
      options: ["100", "500", "1000", "2000"],
    }
  ]
  return (
    <div className="flex flex-1 justify-center p-8">
      <div className=" flex flex-row p-4 justify-start ">
        {/* <input type="radio" name="filter" id="filter"  className="  mr-2"/> */}
         {
          filters.map((filter, _) => (
              <FilterMenu name={filter.name} key={_} filters={filter.options}  />
          ))
         }
      </div>
      
    </div>
  )
}
