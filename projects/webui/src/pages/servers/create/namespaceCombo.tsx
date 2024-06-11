import { ReactElement, ReactNode, useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge.tsx";
import { commandScore } from "cmdk/command-score";

interface NamespaceComboProps {
  items: string[];
  value?: string;
  onChange: (item: string) => void;
  onCreate: (item: string) => void;
  className?: string;
}

const CREATE_NEW_KEY = "+create+";

const CommandCreateItem = ({
  onSelect,
}: {
  onSelect: (value: string) => void;
  selectedValue: string | undefined;
  items: string[];
}) => {
  const query = useCommandState((state) => state.search);
  if (!query) return null;

  return (
    <>
      <CommandGroup heading="Actions">
        <CommandItem
          value={CREATE_NEW_KEY}
          onSelect={() => {
            onSelect(query);
          }}
        >
          <PlusIcon className="mr-2 size-4" />
          {query}
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
    </>
  );
};

export function NamespaceCombo({
  items,
  value,
  onChange,
  onCreate,
  className,
}: NamespaceComboProps): ReactElement {
  const [open, setOpen] = useState(false);
  const id = useMemo(() => window.crypto.randomUUID(), []);

  function displayNamespace(value?: string): ReactNode {
    if (!value) {
      return "Select a namespace";
    }

    const existingNamespace = items.find((ns) => ns === value);
    if (existingNamespace) {
      return existingNamespace;
    }

    return (
      <span className="inline-flex items-center gap-2">
        {value} <Badge className="px-1 py-0">New</Badge>
      </span>
    );
  }

  const isNewNamespace = useMemo(
    () => value !== undefined && value.length > 0 && !items.includes(value),
    [items, value],
  );

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
                id={id}
              >
                {displayNamespace(value)}
                <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent className="w-full p-0" avoidCollisions={true}>
          <Command
            vimBindings={false}
            loop
            filter={(item, query, keywords) => {
              if (item === CREATE_NEW_KEY) {
                const exists = items.find((ns) => ns === query);
                if (query.length > 0 && !exists) {
                  return 1;
                }
                return 0;
              }

              return commandScore(item, query, keywords ?? []);
            }}
          >
            <CommandInput placeholder="Search a namespace..." />
            <CommandList>
              <CommandCreateItem
                items={items}
                selectedValue={value}
                onSelect={(currentValue) => {
                  onCreate(currentValue);
                  setOpen(false);
                }}
              />

              {isNewNamespace && (
                <CommandGroup heading="New namespace">
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={(currentValue) => {
                      if (currentValue !== value) {
                        onCreate(currentValue);
                      }
                      setOpen(false);
                    }}
                  >
                    <CheckIcon className="mr-2 size-4" />
                    {value}
                  </CommandItem>
                </CommandGroup>
              )}

              <CommandGroup heading="Existing namespaces">
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
