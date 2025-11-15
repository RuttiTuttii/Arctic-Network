import { motion } from "motion/react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  const handleLinkClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative border-t border-neutral-800 py-20 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="footerGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerGrid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-2"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-3 h-1 bg-orange-500" />
                ))}
              </div>
              <span className="tracking-wider">ARCTIC NETWORK</span>
            </div>
            <p className="text-neutral-400 leading-relaxed max-w-md mb-6">
              {t("footerDescription")}
            </p>
            <div className="flex gap-4">
              {[
                { name: "Twitter", url: "https://twitter.com" },
                { name: "LinkedIn", url: "https://linkedin.com" },
                { name: "GitHub", url: "https://github.com" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, color: "#f97316" }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 border border-neutral-700 flex items-center justify-center hover:border-orange-500 transition-colors"
                >
                  {social.name[0]}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="tracking-wider mb-6">{t("platform")}</h3>
            <ul className="space-y-3 text-neutral-400">
              {[
                { key: "features", label: t("features") },
                { key: "dashboard", label: t("dashboard") },
                { key: "apiAccess", label: t("apiAccess") },
                { key: "documentation", label: t("documentation") },
                { key: "pricing", label: t("pricing") },
              ].map((link, i) => (
                <li key={i}>
                  <motion.a
                    href="#"
                    onClick={(e) => handleLinkClick(e, link.key)}
                    whileHover={{ x: 5, color: "#f97316" }}
                    className="inline-block transition-colors cursor-pointer"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="tracking-wider mb-6">{t("contact")}</h3>
            <div className="space-y-4 text-neutral-400">
              <a 
                href="mailto:info@arcticnetwork.io"
                className="flex items-start gap-3 hover:text-orange-500 transition-colors"
              >
                <Mail className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <div>info@arcticnetwork.io</div>
                  <div>support@arcticnetwork.io</div>
                </div>
              </a>
              <a 
                href="tel:+15551234567"
                className="flex items-start gap-3 hover:text-orange-500 transition-colors"
              >
                <Phone className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>+1 (555) 123-4567</div>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>Arctic Research Center<br />Tromsø, Norway</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500"
        >
          <div>© 2025 Arctic Network. {t("allRightsReserved")}</div>
          <div className="flex gap-6">
            <motion.a 
              href="#privacy" 
              whileHover={{ color: "#f97316" }} 
              className="transition-colors cursor-pointer"
              onClick={(e) => e.preventDefault()}
            >
              {t("privacyPolicy")}
            </motion.a>
            <motion.a 
              href="#terms" 
              whileHover={{ color: "#f97316" }} 
              className="transition-colors cursor-pointer"
              onClick={(e) => e.preventDefault()}
            >
              {t("termsOfService")}
            </motion.a>
            <motion.a 
              href="#cookies" 
              whileHover={{ color: "#f97316" }} 
              className="transition-colors cursor-pointer"
              onClick={(e) => e.preventDefault()}
            >
              {t("cookiePolicy")}
            </motion.a>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        />
      </div>
    </footer>
  );
}