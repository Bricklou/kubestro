import { Outlet } from 'react-router'
import { ThemeSwitch } from '~/ui/theme-switch'

function LayoutBackground() {
  return (
    <div className="inset-0 -z-10 bg-white bg-grid-pattern bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-inner-circle" />
    </div>
  )
}

export default function DoubleSideLayout() {
  return (
    <div className="flex flex-row min-h-svh overflow-hidden">
      <div className="relative hidden lg:block overflow-hidden flex-1">
        <LayoutBackground />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 border-l border-border bg-background w-full lg:max-w-[45vw] flex-1">
        <div className="flex justify-between items-center gap-2">
          <div className="flex justify-center gap-2 md:justify-start">
            <h1 className="text-2xl font-bold">Kubestro</h1>
          </div>

          <ThemeSwitch />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
