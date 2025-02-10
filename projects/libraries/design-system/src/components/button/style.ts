import { tv } from 'tailwind-variants'
import { linkVariants } from '../link/style'

export const buttonVariants = tv({
  base: 'text-text inline-flex transform items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0 select-none rounded-md',
  variants: {
    variant: {
      'primary': 'border border-primary bg-primary text-primary-text hover:bg-primary-hover active:bg-primary/80',
      'primary-soft': 'bg-primary-soft text-primary-soft-text hover:bg-primary-soft-hover active:bg-primary-soft-hover/80',
      'secondary': 'bg-secondary text-secondary-text hover:bg-secondary-hover active:bg-secondary-hover/80',
      'warning': 'bg-warning text-warning-text hover:bg-warning-hover active:bg-warning-hover/80',
      'danger': 'bg-danger text-danger-text hover:bg-danger-hover active:bg-danger-hover/80',
      'ghost': 'hover:bg-secondary-hover hover:text-secondary-text',
      'link': linkVariants({ className: 'active:scale-100' })
    },
    effect: {
      expandIcon: 'group gap-0 relative',
      ringHover: 'transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2',
      shine:
        'before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,oklch(100%_0_0_/_50%)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat background-position_0s_ease',
      shineHover:
        'relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,oklch(100%_0_0_/_50%)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000',
      gooeyRight:
        'relative z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:from-white/40 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%]',
      gooeyLeft:
        'relative z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:from-white/40 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]',
      underline:
        'relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300',
      hoverUnderline:
        'relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300'
    },
    size: {
      sm: 'rounded-md px-3 py-1',
      md: 'px-4 py-2',
      lg: 'rounded-md px-8 py-3',
      icon: 'size-10'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})
