export type Post = {
  title: string
  date: Date
  slug: string
  meta: { [key: string]: string }
  content: string // markdown
}