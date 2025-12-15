import { useEffect } from "react";

export default function InstagramEmbed({ url }) {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        width: "100%",
        minWidth: "260px",
        margin: 0,
      }}
    />
  );
}
