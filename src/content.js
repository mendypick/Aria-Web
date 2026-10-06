export const external = {
  appStore: "https://apps.apple.com/us/app/aria-black-singles-dating-app/id6670338377",
  play: "https://play.google.com/store/apps/details?id=com.aria.dating",
  email: "mailto:support@aria.dating",
  instagram: "https://www.instagram.com/aria.dating/",
  youtube: "https://www.youtube.com/channel/UCXpnFPeQun-BlMF6kg7IK0Q",
  tiktok: "https://www.tiktok.com/@aria.dating",
  facebook: "https://www.facebook.com/profile.php?id=61565736175850",
  blog: "https://www.ariadating.com/blog/",
};

const file = (path) => `${import.meta.env.BASE_URL}${path}`;

export const copy = {
  metaTitle: "Aria — for Black singles with high standards",
  metaDescription:
    "Aria — a dating app for Black singles with high standards. The goal isn’t to meet everyone. It’s to meet the right people.",
  skip: "Skip to content",
  menu: "Menu",
  close: "Close",
  nav: [
    { href: "#standards", label: "Standards" },
    { href: "#why", label: "Why us" },
    { href: "#faq", label: "FAQ" },
    { href: "#support", label: "Support" },
    { href: "#blog", label: "Blog" },
  ],
  getApp: "Get the app",
  hero: {
    l1: "for Black singles",
    l2: "with high standards.",
  },
  manifesto:
    "Aria is the solo — the moment one voice rises above the rest. That’s the idea behind Aria. A dating app for Black singles with high standards, where the goal isn’t to meet everyone — it’s to meet the right people.",
  standards: "People at your standards",
  singles: [
    {
      src: file("photos/singles/s1.jpg"),
      alt: "A woman smiling on the Chicago lakefront",
    },
    {
      src: file("photos/singles/s2.jpg"),
      alt: "A man in a green polo, standing on a city sidewalk",
    },
    {
      src: file("photos/singles/s3.jpg"),
      alt: "A woman with curly hair, smiling outside a café",
    },
    {
      src: file("photos/singles/s5.jpg"),
      alt: "A man leaning against a brick wall on a city street",
    },
    {
      src: file("photos/singles/s4.jpg"),
      alt: "A woman with braids, looking back on a sunlit street",
    },
  ],
  app: {
    title: "Why us?",
    prev: "Previous screen",
    next: "Next screen",
  },
  screens: [
    {
      id: "standards",
      src: file("photos/app/standards.jpg"),
      alt: "A couple, with the line For Black singles with high standards",
      title: "High standards",
      body: "For Black singles with high standards.",
    },
    {
      id: "values",
      src: file("photos/app/values.jpg"),
      alt: "A profile filtered by African American, Afro-Latino, and Caribbean",
      title: "Values",
      body: "Find someone who shares your values. Afro-Latino, African American, Caribbean, and more.",
    },
    {
      id: "prompts",
      src: file("photos/app/prompts.jpg"),
      alt: "Profile prompts about food, music, and what matters in a relationship",
      title: "Who you are",
      body: "The profile says what actually matters. Food, music, and a conversation that flows.",
    },
    {
      id: "verified",
      src: file("photos/app/verified.jpg"),
      alt: "A verified profile",
      title: "Verified",
      body: "Profiles are verified, so you can connect with confidence.",
    },
    {
      id: "likes",
      src: file("photos/app/likes.jpg"),
      alt: "The likes screen, with people who already like you",
      title: "Likes",
      body: "See who’s already into you, before the conversation starts.",
    },
    {
      id: "matches",
      src: file("photos/app/matches.jpg"),
      alt: "Matches and messages",
      title: "Matches",
      body: "New matches and messages, in one place.",
    },
    {
      id: "couples",
      src: file("photos/app/couples.jpg"),
      alt: "A collage of couples who met on Aria",
      title: "Couples",
      body: "Thousands of Black couples met on Aria.",
    },
  ],
  cta: {
    title: "Eligible Black single? Join Aria.",
    on: "Download on the",
    appStore: "App Store",
    play: "Google Play",
  },
  faq: {
    title: "Everything you’re wondering.",
    items: [
      [
        "Who is Aria for?",
        "Aria is built for the Black community — people who are ready for something real. If you’re looking for serious dating and meaningful connections, this is your space.",
      ],
      [
        "How does Aria keep conversations serious?",
        "Conversations on Aria are actively monitored by AI to make sure they stay respectful and serious. When a conversation turns non-serious, it’s automatically ended. This keeps the experience focused, intentional, and aligned for everyone.",
      ],
      [
        "Is Aria easy to use?",
        "Yes — sign-up is simple and the swiping feels familiar. What’s different is the purpose: every part of the experience is built for serious dating.",
      ],
      [
        "How is Aria different from the big swiping apps?",
        "Everyone here wants the same thing — commitment, not casual. Expectations are clear from the moment you join, and AI-monitored conversations keep things respectful and serious. It’s a familiar experience with a fundamentally different purpose.",
      ],
      [
        "Is Aria free?",
        "You can download Aria and start matching for free. Check the app for current plans and premium features.",
      ],
      [
        "Where can I get the app?",
        "Aria is available now on the Apple App Store and Google Play. Download it, build your profile with intention, and find something real.",
      ],
    ],
  },
  support: {
    eyebrow: "Support",
    title: "We’d like to hear from you.",
    email: "support@aria.dating",
  },
  footer: {
    blurb: "The dating app for Black singles with high standards.",
    nav: "Aria",
    social: "Socials",
    support: "Support",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    blog: "Blog",
    rights: "© Aria — Black Dating App 2026",
    intention: "Made with intention.",
    socials: [
      ["Instagram", "instagram"],
      ["TikTok", "tiktok"],
      ["Facebook", "facebook"],
      ["YouTube", "youtube"],
    ],
  },
};
