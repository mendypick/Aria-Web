import { posts, postBySlug } from "./blog/posts.js";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

function plain(value) {
  return value
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Html({ html, className }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function BlogIndex({ onOpen, onHome }) {
  const [lead, ...rest] = posts;

  return (
    <article className="page blog">
      <div className="wrap blog-wrap">
        <a
          className="back"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            onHome();
          }}
        >
          Back to Aria
        </a>
        <p className="eyebrow">Blog</p>
        <h1>Dating with purpose, in practice.</h1>
        <p className="blog-lede">
          Writing on serious dating, cultural alignment, and what it takes to meet the right people.
        </p>
        <a
          className="blog-lead"
          href={`#post/${lead.slug}`}
          onClick={(event) => {
            event.preventDefault();
            onOpen(lead.slug);
          }}
        >
          <img src={asset(lead.image)} alt="" width="1200" height="750" />
          <div>
            <time dateTime={lead.date}>{formatDate(lead.date)}</time>
            <h2>{plain(lead.title)}</h2>
            <p>{plain(lead.excerpt)}</p>
            <span>Read</span>
          </div>
        </a>
        <div className="blog-list">
          {rest.map((post) => (
            <a
              key={post.slug}
              href={`#post/${post.slug}`}
              onClick={(event) => {
                event.preventDefault();
                onOpen(post.slug);
              }}
            >
              <img src={asset(post.image)} alt="" width="320" height="200" />
              <div>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <h2>{plain(post.title)}</h2>
                <p>{plain(post.excerpt)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export function BlogPost({ slug, onBlog, onOpen }) {
  const post = postBySlug(slug);
  if (!post) {
    return (
      <article className="page blog">
        <div className="wrap blog-wrap">
          <a
            className="back"
            href="#blog"
            onClick={(event) => {
              event.preventDefault();
              onBlog();
            }}
          >
            All posts
          </a>
          <h1>This post isn’t here.</h1>
        </div>
      </article>
    );
  }

  const more = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <article className="page post">
      <div className="wrap post-wrap">
        <a
          className="back"
          href="#blog"
          onClick={(event) => {
            event.preventDefault();
            onBlog();
          }}
        >
          All posts
        </a>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <h1>{plain(post.title)}</h1>
        <img className="post-hero" src={asset(post.image)} alt="" width="1200" height="750" />
        <div className="post-body">
          {post.blocks.map((block, index) => {
            if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
            if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
            if (block.type === "ul" || block.type === "ol") {
              const Tag = block.type;
              return (
                <Tag key={index}>
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Html html={item} />
                    </li>
                  ))}
                </Tag>
              );
            }
            if (block.type === "table") {
              const [head, ...rows] = block.rows;
              return (
                <div className="post-table" key={index}>
                  <table>
                    <thead>
                      <tr>
                        {head.map((cell, cellIndex) => (
                          <th key={cellIndex}>
                            <Html html={cell} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>
                              <Html html={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            const cta = block.html.startsWith('<a href="#download"');
            return (
              <p key={index} className={cta ? "post-cta" : undefined}>
                <Html html={block.html} />
              </p>
            );
          })}
        </div>
        <aside className="post-more">
          <h2>More from the blog</h2>
          <div>
            {more.map((item) => (
              <a
                key={item.slug}
                href={`#post/${item.slug}`}
                onClick={(event) => {
                  event.preventDefault();
                  onOpen(item.slug);
                }}
              >
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                {plain(item.title)}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
