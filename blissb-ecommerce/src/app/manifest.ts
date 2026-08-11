import type { MetadataRoute } from "next";

// Web app manifest — Next auto-adds the <link rel="manifest">. Gives the site a
// name/theme when saved to a home screen and sets the mobile browser UI color.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bliss-B Desserts",
    short_name: "Bliss-B",
    description:
      "Small-batch cookies, cakes, and desserts handcrafted in Braselton, GA.",
    start_url: "/",
    display: "browser",
    background_color: "#FDFBF8",
    theme_color: "#9B562C",
    icons: [{ src: "/icon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
