import { Post, readAllPosts } from 'app/athena/_lib/post'
import Link from 'next/link'
import { use } from 'react'

const Index = () => {
  const allPosts = use(readAllPosts())
  const postsByYear: { [year: string]: Post[] } = {}
  for (let i = 0; i < allPosts.length; i++) {
    const year = allPosts[i].date.getFullYear()
    if (!(year in postsByYear)) { postsByYear[year] = [] }
    postsByYear['' + allPosts[i].date.getFullYear()].push(allPosts[i])
  }
  return (
    <div className="pt-8">
      {Object.keys(postsByYear)
        .map((year) => ({ year: year, posts: postsByYear[year] }))
        .sort((a, b) => a.year < b.year ? 1 : -1)
        .map((pl) => (
          <div key={pl.year} className="pb-3">
            <h4 className="font-bold">{pl.year}</h4>
            <div>
              {pl.posts.sort((a, b) => a.date < b.date ? 1 : -1).map((p) =>
                <Link passHref href={`/athena/post/${p.slug}`} className="block hover:underline mb-3" key={p.slug}>{p.title}</Link>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Index
