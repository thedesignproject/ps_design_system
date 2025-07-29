import * as React from "react"
import { Search as SearchIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface SearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  showClearButton?: boolean
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, onClear, showClearButton = true, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || "")

    const handleClear = () => {
      setValue("")
      onClear?.()
      if (props.onChange) {
        const event = {
          target: { value: "" }
        } as React.ChangeEvent<HTMLInputElement>
        props.onChange(event)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      props.onChange?.(e)
    }

    return (
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className={cn("pl-10 pr-10", className)}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {showClearButton && value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    )
  }
)

Search.displayName = "Search"

export { Search } 