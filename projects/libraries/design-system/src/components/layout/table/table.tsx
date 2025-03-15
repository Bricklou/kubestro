import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={twMerge('w-full caption-bottom text-sm overflow-hidden', className)}
        {...props}
      />
    </div>
  )
}
Table.displayName = 'Table'

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={twMerge('bg-background-contrast [&_tr]:border-b [&_tr]:border-border', className)} {...props} />
  )
}
TableHeader.displayName = 'TableHeader'

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={twMerge('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}
TableBody.displayName = 'TableBody'

export function TableFooter({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={twMerge(
        'border-t border-border bg-secondary/50 font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
}
TableFooter.displayName = 'TableFooter'

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={twMerge(
        'border-b border-border transition-colors not-[thead>&]:hover:bg-secondary/50 data-[state=selected]:bg-primary-soft/60 data-[state=selected]:hover:bg-primary-soft/85',
        className
      )}
      {...props}
    />
  )
}
TableRow.displayName = 'TableRow'

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={twMerge(
        'h-10 px-2 text-left align-middle font-medium text-primary [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}
TableHead.displayName = 'TableHead'

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={twMerge(
        'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}
TableCell.displayName = 'TableCell'

export function TableCaption({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={twMerge('mt-4 text-sm text-text-muted', className)}
      {...props}
    />
  )
}
TableCaption.displayName = 'TableCaption'
