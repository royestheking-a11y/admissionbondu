import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-[#1A0A02] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Terms of Service</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#D4A857] to-[#C8860A] rounded-2xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7 text-[#1A0A02]" />
            </div>
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "2.2rem", fontWeight: 700 }}>Terms of Service</h1>
              <p className="text-white/60 max-w-2xl">
                By using Admission Bondu, you agree to these terms. Please read them carefully.
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
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Use of the service</h2>
            <ul className="text-[#6B3A1F]/70 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>You must provide accurate information during registration and application submissions.</li>
              <li>Do not misuse the platform, attempt unauthorized access, or disrupt services.</li>
              <li>We may suspend accounts for abuse, fraud, or security reasons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Payments</h2>
            <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">
              If you purchase a package, you are responsible for providing correct payment information and references.
              Package fees may change; any changes apply to new purchases only.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Content and accuracy</h2>
            <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">
              University/notice information may change. We try to keep information up to date, but we cannot guarantee completeness or accuracy at all times.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Limitation of liability</h2>
            <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">
              Admission Bondu provides guidance and tooling. Final admission decisions are made by universities and authorities.
              To the maximum extent permitted by law, we are not liable for indirect or consequential damages.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

