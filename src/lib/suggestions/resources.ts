export const TOPIC_RESOURCES: Record<string, { title: string; url: string; type: "article" | "video" | "docs" | "course" }[]> = {
  "javascript-core": [
    { title: "You Don't Know JS", url: "https://github.com/getify/You-Dont-Know-JS", type: "course" },
    { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "docs" },
  ],
  typescript: [
    { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", type: "docs" },
    { title: "Total TypeScript", url: "https://www.totaltypescript.com", type: "course" },
  ],
  react: [
    { title: "React Docs (Beta)", url: "https://react.dev", type: "docs" },
    { title: "Epic React", url: "https://epicreact.dev", type: "course" },
  ],
  "html-css": [
    { title: "MDN HTML Reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", type: "docs" },
    { title: "CSS Tricks", url: "https://css-tricks.com", type: "article" },
  ],
  performance: [
    { title: "Web Vitals", url: "https://web.dev/vitals/", type: "docs" },
    { title: "High Performance Browser Networking", url: "https://hpbn.co", type: "course" },
  ],
  databases: [
    { title: "Use The Index, Luke", url: "https://use-the-index-luke.com", type: "course" },
    { title: "CMU Database Course", url: "https://15445.courses.cs.cmu.edu", type: "video" },
  ],
  "api-design": [
    { title: "RESTful API Design — Best Practices", url: "https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api", type: "article" },
    { title: "API Design Patterns", url: "https://www.manning.com/books/api-design-patterns", type: "course" },
  ],
  caching: [
    { title: "Redis Documentation", url: "https://redis.io/docs/", type: "docs" },
    { title: "Caching Strategies", url: "https://codeahoy.com/2017/08/11/caching-strategies-and-how-to-choose-the-right-one/", type: "article" },
  ],
  "system-design": [
    { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "course" },
    { title: "Designing Data-Intensive Applications", url: "https://dataintensive.net", type: "course" },
  ],
  "ml-fundamentals": [
    { title: "fast.ai Practical Deep Learning", url: "https://course.fast.ai", type: "course" },
    { title: "CS229 Stanford ML", url: "https://cs229.stanford.edu", type: "video" },
  ],
  sql: [
    { title: "SQLZoo", url: "https://sqlzoo.net", type: "course" },
    { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", type: "course" },
  ],
};

export function getResourcesForTopic(tag: string) {
  return TOPIC_RESOURCES[tag] ?? [];
}
