import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Table = forwardRef<
  HTMLTableElement,
  HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      className={twMerge('w-full caption-bottom text-sm', className)}
      ref={ref}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead className={twMerge('[&_tr]:border-b [&_tr]:border-border', className)} ref={ref} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    className={twMerge('[&_tr:last-child]:border-0', className)}
    ref={ref}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    className={twMerge(
      'border-t border-border bg-secondary/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    ref={ref}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    className={twMerge(
      'border-b border-border transition-colors not-[thead>&]:hover:bg-secondary/50 data-[state=selected]:bg-primary-soft/60 data-[state=selected]:hover:bg-primary-soft/85',
      className
    )}
    ref={ref}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    className={twMerge(
      'h-10 px-2 text-left align-middle font-medium text-primary [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    ref={ref}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    className={twMerge(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    ref={ref}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    className={twMerge('mt-4 text-sm text-text-muted', className)}
    ref={ref}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
}
