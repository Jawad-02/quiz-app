import { prettify } from './translations'

// Question categories arrive as free text from the APIs, so map the ones we
// know onto translation keys and fall back to a tidied version of the raw value.
export function categoryLabel(name, t) {
  if (!name) return ''
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return t(`topic.${slug}`, null, prettify(name))
}

export function difficultyLabel(value, t) {
  if (!value) return ''
  return t(`difficulty.${String(value).toLowerCase()}`, null, prettify(value))
}
