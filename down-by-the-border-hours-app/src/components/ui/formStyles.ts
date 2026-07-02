/** 16px minimum prevents iOS Safari from auto-zooming on input focus. */
export const formControlClassName =
  'block w-full min-h-11 rounded-lg border px-3 py-2 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'

export function formControlBorderClass(error?: boolean): string {
  return error ? 'border-red-500' : 'border-slate-300'
}
