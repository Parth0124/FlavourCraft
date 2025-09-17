import { Facebook, Instagram, Twitter, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-white mt-20" style={{ backgroundColor: "#8B5C2B" }}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">FlavorCraft</h2>
          <p className="text-orange-100 leading-relaxed">
            Cook smarter with our AI-powered recipe generator. Discover, create,
            and share meals with the magic of AI.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="grid grid-cols-2 gap-3 md:block md:space-y-2">
            <li>
              <a href="/" className="hover:text-orange-200 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-orange-200 transition">
                About
              </a>
            </li>
            <li>
              <a href="/recipes" className="hover:text-orange-200 transition">
                Recipes
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-orange-200 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="grid grid-cols-2 gap-3 md:block md:space-y-2">
            <li>
              <a href="/blog" className="hover:text-orange-200 transition">
                Blog
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-orange-200 transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="/support" className="hover:text-orange-200 transition">
                Support
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-orange-200 transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-orange-100 mb-4">
            Subscribe to get the latest recipes and cooking tips.
          </p>
          <form className="flex items-center">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-l-lg text-gray-800 bg-amber-50 focus:outline-none w-full"
            />
            <button
              type="submit"
              className="bg-amber-300 text-orange-600 px-4 py-2 rounded-r-lg font-semibold hover:bg-orange-100 transition"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-400/40 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-orange-100">
            © {new Date().getFullYear()} FlavorCraft. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-orange-200">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-orange-200">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-orange-200">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-orange-200">
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:support@flavorcraft.com"
              className="hover:text-orange-200"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
