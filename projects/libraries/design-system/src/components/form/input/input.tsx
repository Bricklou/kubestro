import type { InputHTMLAttributes, RefAttributes } from 'react'
import { inputVariants } from './style'

export type InputProps = InputHTMLAttributes<HTMLInputElement>
  & RefAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return <input className={inputVariants({ className })} {...props} />
}
