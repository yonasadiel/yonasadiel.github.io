import { promises as fs } from 'fs'
import path from 'path'

export type Post = {
  title: string
  date: Date
  slug: string
  meta: { [key: string]: string }
  content: string // markdown
}

export const slugify = (title: string): string => title.toLowerCase().replaceAll(' ', '-').replace(/[:,\.!]/g, '')

export const parsePost = (postContent: string): Post => {
  const lines = postContent.split('\n')
  const title = lines[0]
  const post: Post = {
    title: title,
    date: new Date(),
    slug: slugify(title),
    content: '',
    meta: {},
  }
  let i = 1
  for (; i < lines.length && lines[i] !== ''; i++) {
    const [key, ...rest] = lines[i].split(':')
    post.meta[key.trim()] = rest.join(':').trim()
  }
  post.content = lines.slice(i).join('\n')
  post.date = new Date(post.meta['date'] || '')

  return post
}

const postDir = 'data/posts'

export const readAllPosts = async () => {
  const fileNames = await fs.readdir(postDir)
  const fileContents = await Promise.all(
    fileNames.map(fileName => fs.readFile(path.join(postDir, fileName), 'utf8'))
  )
  return fileContents
    .map(parsePost)
    .sort((a, b) => a.date < b.date ? 1 : -1)
}
