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
    <div className="flex flex-1 px-4 w-40 justify-start">
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between dark:text-gray-950 text-gray-350 font-medium text-lg dark:bg-gray-350 bg-gray-950 group border-0 rounded-full "
        >
          {value
            ? filters.find((filter) => filter === value)
            : name}
          <ChevronDown className="" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-0 ">
        <Command>
          {/* <CommandInput placeholder="Search filter..." className="h-9" /> */}
          <CommandList className=" border-0">
            <CommandEmpty>No filter found.</CommandEmpty>
            <CommandGroup className=" bg-gray-950 border-0 border-gray-100 dark:border-black">
              {filters.map((filter) => (
                <CommandItem
                  key={filter}
                  value={filter}
                  onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  }}
                  className="flex items-center h-9 border-b-2 dark:border-gray-350 border-gray-950 dark:text-gray-950 text-gray-350 font-medium text-lg dark:bg-gray-350 bg-gray-950 group dark:hover:bg-gray-350/50 hover:bg-gray-950/50 border-0 dark:hover:text-gray-950 hover:text-gray-200"
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
