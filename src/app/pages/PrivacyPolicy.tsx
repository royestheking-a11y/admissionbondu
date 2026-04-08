import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-[#1A0A02] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Privacy Policy</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#D4A857] to-[#C8860A] rounded-2xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-7 h-7 text-[#1A0A02]" />
            </div>
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "2.2rem", fontWeight: 700 }}>Privacy Policy</h1>
              <p className="text-white/60 max-w-2xl">
                This policy explains what we collect, how we use it, and the choices you have when using Admission Bondu.
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
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Information we collect</h2>
            <ul className="text-[#6B3A1F]/70 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>Account information (name, email, phone).</li>
              <li>Academic details you provide (SSC/HSC GPA, subject) for personalized guidance.</li>
              <li>Application support details submitted through forms (selected universities, payment reference, etc.).</li>
              <li>Technical data (basic logs) to keep the service secure and reliable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>How we use information</h2>
            <ul className="text-[#6B3A1F]/70 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>To create and manage your account and authentication.</li>
              <li>To provide requested services like admission support and tracking.</li>
              <li>To improve features, performance, and security.</li>
              <li>To respond to support requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Data storage & security</h2>
            <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">
              We store structured data in our database and store uploaded media (such as images and PDFs) with our media provider.
              We use reasonable security practices, but no method of transmission/storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-[#1A0A02] mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Your choices</h2>
            <p className="text-[#6B3A1F]/70 text-sm leading-relaxed">
              You can request updates or deletion of your account data by contacting us via the Contact page.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

