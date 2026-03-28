import satori from "satori";
import resvgPkg from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const WIDTH = 1080;
const HEIGHT = 1350;

const fontRegular = readFileSync(
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
);
const fontBold = readFileSync(
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
);

// NVIDIA green palette
const NVIDIA_GREEN = "#76B900";
const DARK_BG = "#0a0a0a";
const CARD_BG = "#141414";
const ACCENT = "#76B900";
const ACCENT_LIGHT = "#8FD400";
const TEXT_WHITE = "#FFFFFF";
const TEXT_GRAY = "#A0A0A0";
const TEXT_LIGHT = "#E0E0E0";

const subjects = [
  { num: "01", title: "AI Agent Security Foundations", hrs: "4 hrs" },
  { num: "02", title: "OpenClaw Deep Dive", hrs: "5 hrs" },
  { num: "03", title: "NemoClaw Architecture", hrs: "6 hrs" },
  { num: "04", title: "Security Policies In Detail", hrs: "7 hrs" },
  { num: "05", title: "Bare Metal & Linux Setup", hrs: "6 hrs" },
  { num: "06", title: "Public Cloud Deployment", hrs: "8 hrs" },
  { num: "07", title: "Practical Applications", hrs: "8 hrs" },
  { num: "08", title: "Advanced Topics & Ecosystem", hrs: "5 hrs" },
];

const element = {
  type: "div",
  props: {
    style: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: DARK_BG,
      padding: "0",
      fontFamily: "DejaVu Sans",
      position: "relative",
      overflow: "hidden",
    },
    children: [
      // Top accent bar
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            width: "100%",
            height: "6px",
            background: `linear-gradient(90deg, ${NVIDIA_GREEN}, ${ACCENT_LIGHT}, ${NVIDIA_GREEN})`,
          },
        },
      },

      // Header section
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "50px 60px 30px",
          },
          children: [
            // Badge
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#1a2e0a",
                  border: `2px solid ${NVIDIA_GREEN}`,
                  borderRadius: "50px",
                  padding: "10px 28px",
                  marginBottom: "30px",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontSize: "22px",
                        color: NVIDIA_GREEN,
                        fontWeight: "700",
                        letterSpacing: "2px",
                      },
                      children: "NEW FREE COURSE",
                    },
                  },
                ],
              },
            },

            // Title
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontSize: "52px",
                        fontWeight: "700",
                        color: TEXT_WHITE,
                        textAlign: "center",
                        lineHeight: "1.15",
                      },
                      children: "Learn NemoClaw",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontSize: "28px",
                        color: TEXT_GRAY,
                        textAlign: "center",
                        lineHeight: "1.4",
                        maxWidth: "800px",
                      },
                      children:
                        "Master NVIDIA's AI Agent Security Stack",
                    },
                  },
                ],
              },
            },

            // Stats row
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  gap: "40px",
                  marginTop: "28px",
                  marginBottom: "10px",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              fontSize: "36px",
                              fontWeight: "700",
                              color: NVIDIA_GREEN,
                            },
                            children: "8",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              fontSize: "18px",
                              color: TEXT_GRAY,
                            },
                            children: "Modules",
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              fontSize: "36px",
                              fontWeight: "700",
                              color: NVIDIA_GREEN,
                            },
                            children: "49+",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              fontSize: "18px",
                              color: TEXT_GRAY,
                            },
                            children: "Hours",
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              fontSize: "36px",
                              fontWeight: "700",
                              color: NVIDIA_GREEN,
                            },
                            children: "Free",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              fontSize: "18px",
                              color: TEXT_GRAY,
                            },
                            children: "Open Source",
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      // Divider
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            width: "85%",
            height: "1px",
            backgroundColor: "#2a2a2a",
            margin: "0 auto",
          },
        },
      },

      // Modules grid
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            padding: "25px 55px 20px",
            gap: "14px",
          },
          children: subjects.map((s) => ({
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                backgroundColor: CARD_BG,
                borderRadius: "14px",
                padding: "16px 22px",
                border: "1px solid #222",
              },
              children: [
                // Module number
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      backgroundColor: "#1a2e0a",
                      marginRight: "18px",
                      flexShrink: "0",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            fontSize: "20px",
                            fontWeight: "700",
                            color: NVIDIA_GREEN,
                          },
                          children: s.num,
                        },
                      },
                    ],
                  },
                },
                // Title
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flex: "1",
                      fontSize: "22px",
                      color: TEXT_LIGHT,
                      fontWeight: "700",
                    },
                    children: s.title,
                  },
                },
                // Hours
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontSize: "18px",
                      color: TEXT_GRAY,
                      flexShrink: "0",
                    },
                    children: s.hrs,
                  },
                },
              ],
            },
          })),
        },
      },

      // Footer
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "15px 60px 40px",
            marginTop: "auto",
            gap: "16px",
          },
          children: [
            // CTA button
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: NVIDIA_GREEN,
                  borderRadius: "14px",
                  padding: "18px 50px",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontSize: "26px",
                        fontWeight: "700",
                        color: "#000",
                      },
                      children: "Start Learning at pandala.in",
                    },
                  },
                ],
              },
            },
            // Author
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  fontSize: "18px",
                  color: TEXT_GRAY,
                },
                children: "by Shankar Pandala",
              },
            },
          ],
        },
      },

      // Bottom accent bar
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            width: "100%",
            height: "6px",
            background: `linear-gradient(90deg, ${NVIDIA_GREEN}, ${ACCENT_LIGHT}, ${NVIDIA_GREEN})`,
          },
        },
      },
    ],
  },
};

async function main() {
  console.log("Generating LinkedIn carousel image (1080x1350)...");

  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "DejaVu Sans",
        data: fontRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "DejaVu Sans",
        data: fontBold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  // Save SVG for debugging
  mkdirSync("assets", { recursive: true });
  writeFileSync("assets/linkedin-carousel.svg", svg);
  console.log("SVG saved to assets/linkedin-carousel.svg");

  // Convert to PNG
  const { Resvg } = resvgPkg;
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  writeFileSync("assets/linkedin-carousel.png", pngBuffer);
  console.log(
    `PNG saved to assets/linkedin-carousel.png (${pngBuffer.length} bytes)`
  );
}

main().catch(console.error);
