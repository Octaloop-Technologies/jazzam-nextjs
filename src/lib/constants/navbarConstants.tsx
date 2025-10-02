import { FollowUpsIcon, LeadsIcon, SummaryIcon, FormsIcon } from "@/components/svgs/NavbarSvgs";

// ====================================================================
// ==========================| Navbar Links |==========================
// ====================================================================
const navItems = [
  {
    href: "/super-user",
    icon: <LeadsIcon />,
    title: "Leads",
  },
  {
    href: "/super-user/forms",
    icon: <FormsIcon />,
    title: "Forms",
  },
  {
    href: "/super-user/summary",
    icon: <SummaryIcon />,
    title: "Summary",
  },

  {
    href: "/super-user/follow-ups",
    icon: <FollowUpsIcon />,
    title: "Follow Ups",
  },
];

// ====================================================================
// ==========================| Languages |=============================
// ====================================================================
const languages = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "Arabic",
    code: "ar",
  },
];

// ====================================================================
// ==========================| Export |================================
// ====================================================================
export { navItems, languages };
