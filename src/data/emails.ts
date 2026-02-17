export type EmailAction = {
  label: string;
  icon?: string; // Ionicons name
};

export type EmailItem = {
  id: string;
  sender: string;
  subject?: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  threadCount?: number;
  hasReply?: boolean;
  actions?: EmailAction[];
  isAd?: boolean;
  adBrand?: string;
};

export const emails: EmailItem[] = [
  {
    id: "ad-1",
    sender: "Lovevery",
    preview:
      "Play kits designed by child development experts. Get 10% off your first...",
    time: "",
    unread: false,
    starred: false,
    isAd: true,
    adBrand: "Lovevery",
    actions: [{ label: "Read more" }],
  },
  {
    id: "1",
    sender: "Bright Horizons",
    preview: "Reminder: Olivia's parent-teacher conference is tomorrow at 4:30 PM.",
    time: "8m",
    unread: true,
    starred: false,
    actions: [{ label: "Confirm", icon: "calendar-outline" }],
  },
  {
    id: "2",
    sender: "Amazon",
    preview:
      "Your order of Pampers Size 4 (150 ct) has shipped and will arrive by Wednesday.",
    time: "23m",
    unread: true,
    starred: false,
    actions: [{ label: "Track", icon: "locate-outline" }],
  },
  {
    id: "3",
    sender: "Venmo",
    subject:
      "Sarah Chen paid you $42.50 for \"kids birthday party supplies.\"",
    preview:
      "Sarah Chen paid you $42.50 for \"kids birthday party supplies.\"",
    time: "1h",
    unread: true,
    starred: false,
    actions: [{ label: "$42.50", icon: "copy-outline" }],
  },
  {
    id: "4",
    sender: "Pediatrics of Elm Grove",
    subject:
      "Appointment confirmation: Ethan's 4-year wellness check...",
    preview: "Your appointment is scheduled for Thursday, Feb 20 at 9:15 AM.",
    time: "3h",
    unread: false,
    starred: false,
  },
  {
    id: "5",
    sender: "Target Circle",
    preview:
      "Your 20% off baby essentials coupon expires Friday. Stock up on diapers, wipes & more.",
    time: "5h",
    unread: false,
    starred: false,
  },
  {
    id: "6",
    sender: "KiwiCo",
    preview: "This month's crate has shipped! Get ready for volcano science fun.",
    time: "1d",
    unread: false,
    starred: false,
  },
  {
    id: "7",
    sender: "Me, Jess, Dave, Amanda",
    subject: "Re: Spring break cabin trip planning",
    preview: "Re: Spring break cabin trip planning",
    time: "1d",
    unread: true,
    starred: true,
    threadCount: 12,
    hasReply: true,
    actions: [
      { label: "Airbnb link", icon: "link-outline" },
      { label: "+3 files" },
    ],
  },
];
