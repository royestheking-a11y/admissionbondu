import { Link } from "react-router";
import { motion } from "motion/react";
import { AlertTriangle, ChevronRight } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-[#1A0A02] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Disclaimer</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#D4A857] to-[#C8860A] rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-7 h-7 text-[#1A0A02]" />
            </div>
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "2.2rem", fontWeight: 700 }}>Disclaimer</h1>
              <p className="text-white/60 max-w-2xl">
                Important information about the limits of our guidance and the nature of the content on this website.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#D4A857]/20 rounded-2xl p-7 space-y-6"
        >
          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Educational purpose</h2>
            <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">
              The content provided by Admission Bondu is for informational and educational purposes only and does not constitute official admission advice from any university or authority.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>External websites</h2>
            <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">
              We may link to external sites (e.g., university portals). We are not responsible for their content, changes, or availability.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>No guarantee</h2>
            <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">
              Admission requirements, seat plans, and deadlines can change. Always verify critical information from official sources before applying.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

