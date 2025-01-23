import type { ConfigArray, ConfigWithExtends } from 'typescript-eslint'

declare module 'eslint-plugin-kubestro' {
  export function configApp(rooDir: string, ...configBlockToMerge: ConfigWithExtends[]): ConfigArray
}
