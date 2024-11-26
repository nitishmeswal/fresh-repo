// import Header from "@/components/header";

import { FilterMenu } from "@/components/FilterMenu"
import { filters } from "@/data"



export default function Home() {


  const mainServices: {name:string, description:string}[] = [
    {
      name: "Rent GPU",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat quam, bibendum nec gravida at"
    },
    {
      name: "Deploy Model",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat quam, bibendum nec gravida at",
    },
    {
      name: "Start Earning",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat quam, bibendum nec gravida at"
    }
  ]

  return (
    <div className="flex flex-1 w-full p-8 flex-col">
      <div className=" flex flex-row p-4 justify-start ">
        {/* <input type="radio" name="filter" id="filter"  className="  mr-2"/> */}
         {
          filters.map((filter, _) => (
              <FilterMenu name={filter.name} key={_} filters={filter.options}  />
          ))
         }
      </div>
      <div className={ `flex justify-end flex-col py-4 transition-all duration-300`}>
        <ul className=" flex flex-row justify-between">
          {
            mainServices.map((service, _) => (
              <li key={_} className="flex shadow-md group hover:bg-blue-600 flex-col p-4 w-76 mx-4 space-y-2 rounded-2xl bg-gray-850">
                <div className="p-2 space-y-2">
                  <h1 className="text-[24px] font-semibold text-white">{service.name}</h1>
                  <p className="text-[11px] text-gray-450 group-hover:text-[#D8D8D8] ">{service.description}</p>
                </div>
                <button className=" border w-fit rounded-full text-white flex justify-start px-4">
                  start
                </button>
              </li>
            ))
          }
        </ul>

      </div>

      
    </div>
  )
}
