/** 16px minimum prevents iOS Safari from auto-zooming on input focus. */
export const formControlClassName =
  'block w-full min-h-11 rounded-lg border px-3 py-2 text-base text-brand-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue-light'

export function formControlBorderClass(error?: boolean): string {
  return error ? 'border-red-500' : 'border-brand-border-strong'
}
