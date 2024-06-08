import { ReactElement, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  HashIcon,
  PlusIcon,
} from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command.tsx";
import { cn } from "@/lib/utils.ts";
import { FormControl } from "@/components/ui/form.tsx";
import { useCommandState } from "cmdk";

interface NamespaceComboProps {
  items: string[];
  value?: string;
  onChange: (item: string) => void;
  className?: string;
}

const CREATE_NEW_KEY = "+create+";

const CommandCreateItem = ({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) => {
  const query = useCommandState((state) => state.search);
  if (!query) return null;

  return (
    <CommandItem
      forceMount
      value={CREATE_NEW_KEY}
      onSelect={() => {
        onSelect(query);
      }}
    >
      <PlusIcon className="mr-2 size-4" />
      {query}
    </CommandItem>
  );
};

export function NamespaceCombo({
  items,
  value,
  onChange,
  className,
}: NamespaceComboProps): ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative w-[200px]", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <FormControl>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {value
                  ? items.find((item) => item === value)
                  : "Select a namespace"}
                <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search a namespace..." />
            <CommandList>
              <CommandGroup>
                <CommandCreateItem
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                />

                <CommandSeparator />

                {items.map((ns) => (
                  <CommandItem
                    key={ns}
                    value={ns}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {value === ns ? (
                      <CheckIcon className="mr-2 size-4" />
                    ) : (
                      <HashIcon className="mr-2 size-4 text-muted-foreground opacity-50" />
                    )}
                    {ns}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
