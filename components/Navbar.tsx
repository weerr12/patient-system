"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavAction {
  label: string;
  href: string;
  variant: "ghost" | "primary";
}

const NAV_ACTIONS: NavAction[] = [
  { label: "Staff Dashboard", href: "/staff", variant: "ghost" },
  { label: "Patient Registration", href: "/patient", variant: "primary" },
];

function NavActionItem({
  label,
  href,
  onClick,
  fullWidth = false,
}: NavAction & { onClick?: () => void; fullWidth?: boolean }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(fullWidth && "w-full block")}
    >
      <Button
        variant="ghost"
        className={cn(
          "hl-14px-500 rounded-full transition-all text-basic-base-black hover:text-ci-primary hover:bg-ci-primary/10 cursor-pointer",
          fullWidth ? "w-full justify-start px-4 py-3" : "px-6 py-2",
        )}
      >
        {label}
      </Button>
    </Link>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-basic-gray-40 bg-basic-base-white/80 backdrop-blur-md transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <Link
            href="/"
            className="hl-18px-500 sm:hl-20px-500 text-basic-base-black hover:text-ci-primary transition-colors duration-300"
          >
            LOGO
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            {NAV_ACTIONS.map((action) => (
              <NavActionItem key={action.href} {...action} />
            ))}
          </div>

          <div className="sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-basic-gray-70 hover:bg-basic-gray-20 hover:text-ci-primary transition-colors"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-xs bg-basic-base-white border-l border-basic-gray-30 p-0 flex flex-col"
              >
                <SheetHeader className="px-6 py-5 border-b border-basic-gray-30 text-left">
                  <SheetTitle className="hl-20px-500 text-basic-base-black">
                    LOGO
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4 py-4 flex-1">
                  {NAV_ACTIONS.map((action) => (
                    <NavActionItem
                      key={action.href}
                      {...action}
                      fullWidth
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
