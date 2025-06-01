import "../globals.css";

import { seoMetadata } from "@/app/[lng]/translate";

const languages = ["zh-TW", "en"];

export async function generateMetadata({ params: { lng } }) {
  if (!languages.includes(lng)) lng = "en";
  return {
    // head metadata
    title: seoMetadata[lng].title,
    description: seoMetadata[lng].description,
    generator: "Next.js",
    applicationName: seoMetadata[lng].title,
    referrer: "origin-when-cross-origin",
    authors: [
      { name: seoMetadata[lng].author },
      { name: seoMetadata[lng].author2, url: seoMetadata[lng].authorURL },
    ],
    creator: seoMetadata[lng].author,
    publisher: seoMetadata[lng].author,
    // favicon
    icons: {
      icon: "/static/favicon.jpg",
    },
    // OG
    openGraph: {
      title: seoMetadata[lng].title,
      description: seoMetadata[lng].description,
      url: seoMetadata[lng].url,
      siteName: seoMetadata[lng].title,
      images: [
        {
          url: "https://minayu.site/img/portfolio/banqi-small-icon.png", // Must be an absolute URL
          width: 800,
          height: 600,
          alt: "Banqi Chinese Chess",
        },
      ],
      locale: lng,
      type: "website",
    },
    // Twitter
    twitter: {
      card: "summary",
      title: seoMetadata[lng].title,
      description: seoMetadata[lng].description,
      creator: seoMetadata[lng].author,
      images: {
        url: "https://minayu.site/img/portfolio/banqi-small-icon.png",
        alt: "Banqi Chinese Chess",
      },
    },
  };
}

export default function RootLayout({ children }) {
  return <div>{children}</div>;
}
