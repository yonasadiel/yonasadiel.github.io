import fs from 'fs'

export type Post = {
  title: string
  date: Date
  slug: string
  meta: { [key: string]: string }
  content: string // markdown
}

export const slugify = (title: string): string => title.toLowerCase().replaceAll(' ', '-').replaceAll(':', '')

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

const readDir = (path: fs.PathLike) =>
  new Promise<string[]>((resolve, reject) => fs.readdir(path, (err, files) => !!err ? reject(err) : resolve(files)))

const readFile = (fileName: fs.PathOrFileDescriptor) =>
  new Promise<string>((resolve, reject) => fs.readFile(fileName, {}, (err, data) => !!err ? reject(err) : resolve(data.toString('utf8'))))

const postDir = 'data/posts/'
export const readAllPosts = () => readDir(postDir)
  .then((fileNames) => Promise.all(fileNames.map((fileName) => readFile(postDir + fileName))))
  .then((fileContents) => fileContents.map(parsePost).sort((a, b) => a.date < b.date ? 1 : -1))