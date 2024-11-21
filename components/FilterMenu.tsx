"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function FilterMenu({ name, filters}: {name: string, filters: string[]}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <div className="flex flex-1 px-4 w-40 text-white">

    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-gray-350 font-medium text-lg bg-gray-950 group hover:bg-gray-800 border-0 rounded-full hover:text-gray-200"
        >
          {value
            ? filters.find((filter) => filter[0] === value)?.[1]
            : name}
          <ChevronDown className="" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-0 ">
        <Command>
          {/* <CommandInput placeholder="Search filter..." className="h-9" /> */}
          <CommandList>
            <CommandEmpty>No filter found.</CommandEmpty>
            <CommandGroup className=" bg-gray-950">
              {filters.map((filter) => (
                <CommandItem
                  key={filter}
                  value={filter}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="flex items-center h-9 border-b-2 border-gray-950  text-gray-350 font-medium text-lg bg-gray-950 group hover:bg-gray-950/50 border-0  hover:text-gray-200"
                >
                  {filter}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === filter ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
</div>
  )
}
