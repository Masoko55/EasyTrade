// /easytrade-ui/src/app/ui/footer.tsx
import Link from "next/link";
import EasyTradeLogo from "./easytrade-logo"; // Optional: if you want the logo in the footer
import { montserrat } from "./fonts";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 relative z-10 mt-auto"> {/* mt-auto pushes footer down */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <EasyTradeLogo size="text-2xl" className="mb-2 justify-center md:justify-start" />
            <p className={`${montserrat.className} text-sm text-gray-600`}>
              Your trusted C2C marketplace.
            </p>
          </div>
          <div>
            <h3 className={`${montserrat.className} text-md font-semibold text-gray-800 mb-3`}>Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-easytrade-blue">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-easytrade-blue">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-easytrade-blue">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={`${montserrat.className} text-md font-semibold text-gray-800 mb-3`}>Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-gray-600 hover:text-easytrade-blue">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-easytrade-blue">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EasyTrade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
