import { ResponseParamsList } from "@app-store/apps/mini-blog/api-contracts/posts/list";
import Shell from "@app-store/shared/components/Shell";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

async function getPosts() {
  const response = await axios.get("/api/apps/mini-blog/posts/list");
  const responseData: ResponseParamsList = response.data;
  return responseData;
}

function buildPostExcerpt(postContent: string) {
  return `${postContent.substring(0, 144)}...`;
}

export default function Index() {
  const { data: posts } = useQuery(["posts"], getPosts);

  return (
    <Shell>
      <div className="layout py-8">
        <h1 className="h1">Mini blog</h1>
        <section className="pb-6 border-b-4 border-white border-dotted"></section>
        <div>
          {posts?.map((post) => (
            <div key={post.id} className="py-6 border-b-4 border-white border-dotted">
              <h2 className="h2">{post.title}</h2>
              <p className="paragraph">{buildPostExcerpt(post.content)}</p>
              <Link href={`/apps/mini-blog/posts/${post.id}`}>
                <a className="link">Read more</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
