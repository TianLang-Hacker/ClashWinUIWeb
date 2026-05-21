import { marked } from 'marked'

const blogModules = import.meta.glob('/src/contents/blogs/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const docsModules = import.meta.glob('/src/contents/docs/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

marked.use({
  breaks: false,
  gfm: true,
})

const parseFrontmatterValue = (value) => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ''
  }

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"'))
    || (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1)
  }

  if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
    return trimmedValue
      .slice(1, -1)
      .split(',')
      .map((item) => parseFrontmatterValue(item))
      .filter(Boolean)
  }

  return trimmedValue
}

const parseFrontmatter = (rawContent) => {
  const normalizedContent = String(rawContent).replace(/^\uFEFF/, '')
  const lines = normalizedContent.split(/\r?\n/)

  if (lines[0]?.trim() !== '---') {
    return {
      content: normalizedContent,
      data: {},
    }
  }

  const endIndex = lines.findIndex((line, index) => (
    index > 0 && line.trim() === '---'
  ))

  if (endIndex === -1) {
    return {
      content: normalizedContent,
      data: {},
    }
  }

  const data = {}
  let currentKey = ''

  for (const line of lines.slice(1, endIndex)) {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue
    }

    const listItem = line.match(/^\s*-\s*(.*)$/)

    if (listItem && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = data[currentKey] ? [data[currentKey]] : []
      }

      data[currentKey].push(parseFrontmatterValue(listItem[1]))
      continue
    }

    const field = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/)

    if (field) {
      const [, key, value = ''] = field

      currentKey = key
      data[key] = parseFrontmatterValue(value)
      continue
    }

    currentKey = ''
  }

  return {
    content: lines.slice(endIndex + 1).join('\n').replace(/^\s*\n/, ''),
    data,
  }
}

const slugify = (value) => {
  const slug = String(value)
    .normalize('NFKD')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'untitled'
}

const titleFromSlug = (slug) => (
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
)

const pathToSlug = (path) => {
  const filename = path.split('/').pop()?.replace(/\.md$/i, '') ?? 'untitled'

  return slugify(filename)
}

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String)
  }

  return value ? [String(value)] : []
}

const parseDate = (value) => {
  if (!value) {
    return null
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  const dateText = String(value).trim()
  const spacedDate = dateText.match(/^(\d{1,2})\s+(\d{1,2})\s+(\d{4})$/)

  if (spacedDate) {
    const [, day, month, year] = spacedDate
    const parsed = new Date(Number(year), Number(month) - 1, Number(day))

    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const parsed = new Date(dateText)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const padDatePart = (value) => String(value).padStart(2, '0')

const toIsoDate = (date) => {
  if (!date) {
    return ''
  }

  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-')
}

const formatDate = (date) => {
  if (!date) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const stripMarkdown = (markdown) => (
  markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
)

const stripHtml = (html) => (
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
)

const escapeAttribute = (value) => (
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
)

const createMarkdownOutput = (content) => {
  const toc = []
  const usedHeadingIds = new Map()
  const renderer = new marked.Renderer()

  renderer.heading = function ({ tokens, depth }) {
    const textHtml = this.parser.parseInline(tokens)

    if (depth !== 2 && depth !== 3) {
      return `<h${depth}>${textHtml}</h${depth}>\n`
    }

    const title = stripHtml(textHtml)
    const baseId = slugify(title)
    const usedCount = usedHeadingIds.get(baseId) ?? 0
    const id = usedCount ? `${baseId}-${usedCount + 1}` : baseId

    usedHeadingIds.set(baseId, usedCount + 1)
    toc.push({ depth, id, title })

    return `<h${depth} id="${escapeAttribute(id)}">${textHtml}</h${depth}>\n`
  }

  return {
    html: marked.parse(content, { renderer }),
    toc,
  }
}

const truncateText = (value, maxLength = 160) => {
  const characters = Array.from(value)

  if (characters.length <= maxLength) {
    return value
  }

  return `${characters.slice(0, maxLength).join('').trim()}...`
}

const createExcerpt = (content) => truncateText(stripMarkdown(content))

const createContentItem = ([path, rawContent], index, collection) => {
  const { content, data } = parseFrontmatter(rawContent)
  const slug = pathToSlug(path)
  const parsedDate = parseDate(data.pubDate)
  const title = data.title ? String(data.title) : titleFromSlug(slug)
  const description = data.description
    ? String(data.description)
    : createExcerpt(content)
  const markdown = createMarkdownOutput(content)

  return {
    categories: toArray(data.categories),
    collection,
    content,
    date: parsedDate,
    dateIso: toIsoDate(parsedDate),
    description,
    formattedDate: formatDate(parsedDate),
    html: markdown.html,
    image: data.image ? String(data.image) : '',
    order: index,
    slug,
    sortDate: parsedDate?.getTime() ?? 0,
    tags: toArray(data.tags),
    title,
    toc: markdown.toc,
  }
}

const createCollection = (modules, collection) => (
  Object.entries(modules)
    .map((entry, index) => createContentItem(entry, index, collection))
    .sort((first, second) => (
      second.sortDate - first.sortDate
      || first.title.localeCompare(second.title)
      || first.order - second.order
    ))
)

export const blogPosts = createCollection(blogModules, 'blog')
export const docs = createCollection(docsModules, 'docs')

export const getBlogPost = (slug) => (
  blogPosts.find((post) => post.slug === slug)
)

export const getDoc = (slug) => (
  docs.find((doc) => doc.slug === slug)
)
