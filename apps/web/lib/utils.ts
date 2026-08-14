import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface SelectOption {
  id: string
  value: string
}

export function normalizeOptions(rawOptions: any): SelectOption[] {
  if (!rawOptions) return []
  let opts = rawOptions
  if (typeof opts === 'string') {
    try {
      opts = JSON.parse(opts)
    } catch {
      opts = (opts as string).split(',').map((s: string) => s.trim())
    }
  }
  if (!Array.isArray(opts)) return []

  return opts.map((opt: any, index: number) => {
    if (typeof opt === 'string') {
      return { id: `opt_${index}_${opt}`, value: opt }
    }
    if (typeof opt === 'number' || typeof opt === 'boolean') {
      return { id: `opt_${index}`, value: String(opt) }
    }
    if (opt && typeof opt === 'object') {
      const val =
        opt.value ??
        opt.label ??
        opt.text ??
        opt.name ??
        opt.title ??
        (opt.id && typeof opt.id === 'string' && !opt.id.startsWith('opt_') ? opt.id : '')
      return {
        id: String(opt.id || `opt_${index}`),
        value: String(val !== undefined && val !== null ? val : ''),
      }
    }
    return { id: `opt_${index}`, value: '' }
  })
}

export function getOptionValues(rawOptions: any): string[] {
  const normalized = normalizeOptions(rawOptions)
  return normalized.map((o) => o.value.trim()).filter((v) => v.length > 0)
}
