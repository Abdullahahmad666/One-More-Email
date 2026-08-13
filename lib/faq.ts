/**
 * FAQ answers the objections in the order a cold visitor actually has them.
 * Rendered as an accordion and as FAQPage schema (§5a, §7d).
 */
export const FAQ = [
  {
    q: "What does my client actually receive?",
    a: "A professional email from you, in plain text, that reads like you wrote it yourself. The tier names are ours — your client never sees the word \"Disappointed\". You can read all five emails word for word in the hero above before you sign up.",
  },
  {
    q: "Does it send from my email address?",
    a: "It sends from our sending domain with Reply-To set to your real address, so anything your client replies goes straight to your normal inbox. On the Studio plan you can send from your own domain instead.",
  },
  {
    q: "What happens when they reply?",
    a: "You get the reply, in your inbox, like any other email. We don't build an inbox and we don't sit in the middle of the conversation.",
  },
  {
    q: "How do I stop the emails?",
    a: "One button that says They paid. It cancels the rest of the sequence and settles the invoice. If a client asks for time, Pause 7 days holds everything without losing the schedule.",
  },
  {
    q: "When do the emails go out?",
    a: "Weekdays, during working hours. Never at night, never at the weekend. A final notice landing at 3am reads unhinged and doesn't get paid any faster.",
  },
  {
    q: "Is the last email aggressive?",
    a: "It's firm and it's factual. It never claims to be a collections agency or a solicitor, never invents late fees that weren't in your original agreement, and never threatens anything you haven't decided to do.",
  },
  {
    q: "What does it cost?",
    a: "Free for 2 active invoices, forever. $9/month for 20, $19/month for unlimited plus sending from your own domain. One recovered invoice pays for years of it.",
  },
] as const;
