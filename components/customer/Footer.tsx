import Link from "next/link";

const footerGroups = [
  {
    heading: "Help",
    links: [
      { label: "FAQs",             href: "/faqs" },
      { label: "Cancellation Policy", href: "/cancellations" },
      { label: "Contact Support",  href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Bokysh", href: "/about" },
      { label: "Careers",      href: "/careers" },
      { label: "Press",        href: "/press" },
    ],
  },
  {
    heading: "Partner",
    links: [
      { label: "List Your Event", href: "/vendor" },
      { label: "Advertise With Us", href: "/advertise" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use",   href: "/terms" },
    ],
  },
];

export default function CustomerFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] mt-8">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {footerGroups.map((g) => (
            <div key={g.heading}>
              <h4 className="text-xs font-bold text-white/25 uppercase tracking-widest mb-3">
                {g.heading}
              </h4>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Bokysh Technologies Pvt. Ltd.
          </span>
          <div className="flex items-center gap-4">
            {["Twitter", "Instagram", "YouTube"].map((s) => (
              <Link key={s} href="#" className="text-xs text-white/25 hover:text-white/60 transition-colors">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
