import { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import styles from "../../styles/Post.module.css";
import BlockContent from "@sanity/block-content-to-react";
import { Toolbar } from "../../components/toolbar";

export const Post = ({ title, body, image }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const imgBuilder = imageUrlBuilder({
      projectId: "zo0rgvm4",
      dataset: "production",
    });

    setImageUrl(imgBuilder.image(image));
  }, [image]);

  return (
    <div>
      <Toolbar />
      <div className={styles.main}>
        <h1>{title}</h1>

        {imageUrl && <img className={styles.mainImage} src={imageUrl} />}

        <div className={styles.body}>
          <BlockContent
            blocks={body}
            imageOptions={{ w: 375, h: 540, fit: "max" }}
            projectId="zo0rgvm4"
            dataset="production"
          />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  if (!pageSlug) {
    return {
      notFound: true,
    };
  }

  const query = encodeURIComponent(
    `*[ _type == "post" && slug.current == "${pageSlug}" ]`
  );
  const url = `https://zo0rgvm4.api.sanity.io/v1/data/query/production?query=${query}`;

  const result = await fetch(url).then((res) => res.json());

  const post = result.result[0];

  if (!post) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        body: post.body,
        title: post.title,
        image: post.mainImage,
        // name: post.author.name,
        // authorImage: post.author.image,
      },
    };
  }
};
// ---------------------

export default Post;
