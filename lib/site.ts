export const SITE = {
  name: "One More Email",
  tagline: "automatic invoice chasing for freelancers",
  description:
    "Automatic invoice chasing for freelancers. It gets firmer on a schedule so you don't have to. Petty on the inside, polite on the outside.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Sending happens from a subdomain, never the root domain (§9b).
  sendingDomain: process.env.NEXT_PUBLIC_SENDING_DOMAIN ?? "send.onemoreemail.app",
  fromAddress: "chase@onemoreemail.app",
} as const;
