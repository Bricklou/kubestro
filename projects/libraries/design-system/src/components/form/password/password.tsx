import { Check, Eye, EyeOff, X } from 'lucide-react'
import type { InputHTMLAttributes, RefAttributes } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'
import { Input } from '../input'
import { Progress } from '@/components/base/progress'
import { Button } from '@/components/base/button'

// Define a Zod schema for password validation
const passwordSchema = z.string().superRefine((val, ctx) => {
  // Password length >= 8
  if (val.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: 'At least 8 characters',
      minimum: 8,
      inclusive: true,
      type: 'string'
    })
  }
  // Password contains numbers
  if (!(/[0-9]/).test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least 1 number'
    })
  }
  // Password contains lowercase letters
  if (!(/[a-z]/).test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least 1 lowercase letter'
    })
  }
  // Password contains uppercase letters
  if (!(/[A-Z]/).test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least 1 uppercase letter'
    })
  }
  // Password contains any kind of special characters
  if (!(/[^\w\s]/).test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least 1 special character'
    })
  }
})

type PasswordVerificationProps =
  Pick<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id' | 'name' | 'required'> & RefAttributes<HTMLInputElement>
  & {
    // Emit the validity state of the password
    readonly onValidityChange?: (isValid: boolean) => void
  }

export function PasswordVerification({
  className,
  onValidityChange,
  ...props
}: PasswordVerificationProps) {
  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])

  const toggleVisibility = useCallback(() => { setIsVisible(prevState => !prevState) }, [])

  const validatePassword = useCallback((pass: string) => {
    const validationResult = passwordSchema.safeParse(pass)

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(
        issue => issue.message
      )
      setErrors(errorMessages)
      onValidityChange?.(false)
    }
    else {
      // No errors if validation passed
      setErrors([])
      onValidityChange?.(true)
    }
  }, [onValidityChange])

  useEffect(() => {
    validatePassword(password)
  }, [password, validatePassword])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value
    setPassword(pass)
    validatePassword(pass)
  }, [validatePassword])

  const strengthScore = 4 - errors.length

  const getStrengthColor = useCallback((score: number) => {
    // Gray for empty or invalid
    if (score === 0) return 'bg-transparent'
    // Red for weak
    if (score <= 1) return 'bg-red-400'
    // Orange for medium
    if (score <= 2) return 'bg-orange-400'
    // Yellow for medium-strong
    if (score === 3) return 'bg-yellow-400'
    // Green for strong
    return 'bg-green-400'
  }, [])

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Enter a password'
    if (score <= 2) return 'Weak password'
    if (score === 3) return 'Medium password'
    return 'Strong password'
  }

  return (
    <motion.div
      className="size-full center flex-col"
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg w-full">
        <div className="relative">
          <Input
            aria-describedby="password-strength"
            aria-invalid={strengthScore < 4}
            className={twMerge('pe-9', className)}
            onChange={handleChange}
            type={isVisible ? 'text' : 'password'}
            value={password}
            {...props}
          />

          <div className="absolute inset-y-px end-1 flex items-center justify-center h-full">
            <Button
              aria-controls="password"
              aria-label={isVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isVisible}
              className="size-7 text-muted-foreground/80 hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              onClick={toggleVisibility}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isVisible ?
                (
                  <EyeOff aria-hidden="true" className="size-9" strokeWidth={2} />
                ) :
                (
                  <Eye aria-hidden="true" className="size-9" strokeWidth={2} />
                )}
            </Button>
          </div>
        </div>

        {/* Password strength indicator */}
        <Progress
          aria-label="Password strength"
          aria-valuemax={4}
          aria-valuemin={0}
          className="mt-3 mb-4 h-1.5 transition-colors"
          indicatorClassName={getStrengthColor(strengthScore)}
          value={Math.max(strengthScore, 0)}
        />

        {/* Password strength description */}
        <p
          className="mb-2 text-sm font-medium text-foreground"
          id="password-strength"
        >
          {getStrengthText(strengthScore)}. Must contain:
        </p>

        {/* Password requirements list */}
        <ul aria-label="Password requirements" className="space-y-1.5">
          {[
            'At least 8 characters',
            'At least 1 number',
            'At least 1 lowercase letter',
            'At least 1 uppercase letter',
            'At least 1 special character'
          ].map((reqText, index) => (
            <li className="flex items-center space-x-2" key={index}>
              {errors.includes(reqText) ?
                (
                  <X
                    aria-hidden="true"
                    className="text-muted-foreground/80"
                    size={16}
                  />
                ) :
                (
                  <Check
                    aria-hidden="true"
                    className="text-emerald-500"
                    size={16}
                  />
                )}

              <span
                className={`text-xs ${errors.includes(reqText) ?
                  'text-muted-foreground' :
                  'text-emerald-600'
                  }`}
              >
                {reqText}

                <span className="sr-only">
                  {errors.includes(reqText) ?
                    ' - Requirement not met' :
                    ' - Requirement met'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
