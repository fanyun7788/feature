import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  className?: string
}

export function Button({ children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'shadow-lg hover:shadow-xl',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default function Empty() {
  return (
    <div className={cn('flex h-full items-center justify-center')}>Empty</div>
  )
}
