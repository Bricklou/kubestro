import type { ToasterToast } from './use-toast'
import { useToast } from './use-toast'
import {
  Toast, ToastClose, ToastDescription, ToastIcon, ToastProvider, ToastTitle, ToastViewport
} from './toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, action, ...props }: ToasterToast) => {
        const variant = props.variant ?? 'info'

        return (
          <Toast duration={5_000} key={id} {...props}>
            <div className="flex flex-row flex-1 items-center gap-1">
              <div className="flex flex-col">
                <div className="inline-flex gap-2 items-center">
                  <ToastIcon variant={variant} />
                  {title ? <ToastTitle variant={variant}>{title}</ToastTitle> : null}
                </div>

                <div className="pl-6 text-text-muted">
                  {description ? <ToastDescription>{description}</ToastDescription> : null}
                </div>
              </div>

            </div>

            {action}
            <ToastClose variant={variant} />
          </Toast>
        )
      })}

      <ToastViewport />
    </ToastProvider >
  )
}
