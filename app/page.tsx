import Link from "next/link";
import { ArrowRight, UserPlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="bg-linear-to-b from-basic-gray-10 to-basic-base-white flex flex-col min-h-screen">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <h1 className="hl-32px-700 sm:hl-40px-700 lg:hl-48px-700 text-basic-base-black mb-4">
          Welcome
        </h1>
        <p className="hl-14px-400 sm:hl-16px-400 text-basic-gray-70 mb-10 max-w-xs sm:max-w-sm">
          Please select how you would like to continue
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none">
          <Link href="/patient" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-ci-primary hover:bg-ci-neutral text-basic-base-white rounded-full px-6 sm:px-8 py-5 sm:py-6 hl-16px-500 sm:hl-18px-500 shadow-lg transition-all group cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              I am a Patient
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/staff" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-5 sm:py-6 hl-16px-500 sm:hl-18px-500 border-basic-gray-40 hover:border-basic-gray-50 hover:bg-basic-gray-10 text-basic-gray-70 transition-all cursor-pointer"
            >
              <ShieldCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-ci-primary" />
              I am Staff
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
