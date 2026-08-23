import { ImageResponse } from "next/og";
import { TIERS } from "@/lib/ladder";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} - automatic invoice chasing for freelancers`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The ladder, not a dashboard screenshot. This image is what renders on every
 * Reddit, X and Slack share, so it does more work than any other single asset
 * on the site.
 *
 * Colours are literal hex rather than our CSS custom properties: this renders
 * through Satori, which has no cascade and no var() resolution. Keep these in
 * step with the tokens in globals.css.
 */
const PAPER = "#E8ECE5";
const CARD = "#FBFCFA";
const RULE = "#C9D0C4";
const INK = "#141B17";
const INK_2 = "#4A554D";
const INK_3 = "#7C8880";

const RAMP: Record<number, string> = {
  1: "#5F7D6E",
  2: "#7B8A55",
  3: "#B08428",
  4: "#BE5D26",
  5: "#9E1B21",
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: PAPER,
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: the promise */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 620,
            paddingRight: 48,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: 4,
                color: INK_3,
                textTransform: "uppercase",
              }}
            >
              {SITE.name}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 40,
                fontSize: 60,
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: -1.6,
                color: INK,
              }}
            >
              You wrote the first email. We&apos;ll write the next four.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              lineHeight: 1.45,
              color: INK_2,
            }}
          >
            Automatic invoice chasing that gets firmer on a schedule.
          </div>
        </div>

        {/* Right: the ladder */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            backgroundColor: CARD,
            border: `1px solid ${RULE}`,
            borderRadius: 12,
            padding: 32,
          }}
        >
          {[...TIERS].reverse().map((tier, i) => (
            <div
              key={tier.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                paddingTop: 29,
                paddingBottom: 29,
                borderTop: i === 0 ? "none" : `1px solid ${RULE}`,
              }}
            >
              <div style={{ display: "flex", fontSize: 18, color: INK_3, width: 28 }}>
                0{tier.id}
              </div>

              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  letterSpacing: 1.4,
                  color: INK,
                  textTransform: "uppercase",
                  width: 168,
                }}
              >
                {tier.name}
              </div>

              <div
                style={{
                  display: "flex",
                  flex: 1,
                  height: 12,
                  borderRadius: 999,
                  backgroundColor: RAMP[tier.id],
                }}
              />

              <div style={{ display: "flex", fontSize: 18, color: INK_3, width: 52, justifyContent: "flex-end" }}>
                +{tier.defaultOffset}d
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
