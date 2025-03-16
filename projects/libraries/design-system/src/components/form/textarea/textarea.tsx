import type { RefAttributes, TextareaHTMLAttributes } from 'react'
import { textareaVariants } from './style'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>
  & RefAttributes<HTMLTextAreaElement>

export function Textarea({ className, ref, ...props }: TextareaProps) {
  return (
    <textarea className={textareaVariants({ className })} ref={ref} {...props} />
  )
}
Textarea.displayName = 'Textarea'
