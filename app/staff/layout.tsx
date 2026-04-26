import Link from "next/link";
import { LayoutDashboard, type LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  disabled?: boolean;
}

interface HeaderLink {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/staff", icon: LayoutDashboard },
];

const HEADER_LINKS: HeaderLink[] = [
  { label: "Home", href: "/" },
  { label: "Patient Form", href: "/patient" },
];

function SidebarNavItem({ item }: { item: NavItem }) {
  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg hl-14px-500 transition-colors";

  if (item.disabled || !item.href) {
    return (
      <div className={`${baseClass} text-basic-gray-50 cursor-not-allowed`}>
        <item.icon className="w-5 h-5 shrink-0" />
        {item.label}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${baseClass} bg-ci-primary/10 text-ci-primary`}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      {item.label}
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-full max-w-[256px] shrink-0 bg-basic-base-white border-r border-basic-gray-40">
      <Link href="/" className="px-6 py-4 border-b border-basic-gray-40">
        <h2 className="hl-20px-700 text-basic-gray-90">Staff View</h2>
      </Link>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <header className="bg-basic-base-white border-b border-basic-gray-40 flex items-center justify-end px-4 sm:px-6 py-5 shrink-0 shadow-sm">
      <nav className="flex items-center gap-4 sm:gap-6">
        {HEADER_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="hl-14px-500 text-basic-gray-60 hover:text-ci-primary transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-basic-gray-10 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
