import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Bell, Search, Download, ChevronRight, Calendar, Tag, AlertCircle, Clock } from "lucide-react";
import { apiFetch } from "../lib/api";
import { initialNotices } from "../data/notices";
import { Seo } from "../components/Seo";

const categories = ["All", "Deadline", "Result", "Circular", "Medical", "Scholarship", "Exam Schedule"];

const categoryColors: Record<string, string> = {
  Deadline: "bg-red-100 text-red-700",
  Result: "bg-green-100 text-green-700",
  Circular: "bg-amber-100 text-amber-700",
  Medical: "bg-blue-100 text-blue-700",
  Scholarship: "bg-purple-100 text-purple-700",
  "Exam Schedule": "bg-orange-100 text-orange-700",
};

export default function Notice() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Seo
        title="University Admission Notices 2026 – Public & Private Universities | Admission Bondhu"
        description="Get the latest university admission notices, circulars, results, and deadlines for all public and private universities in Bangladesh."
        keywords={[
          "university admission notices 2026",
          "university admission Bangladesh",
          "public university admission",
          "private university admission Bangladesh",
          "university admission deadline Bangladesh",
          "admission circular Bangladesh",
          "admission results Bangladesh",
        ].join(", ")}
        canonicalPath="/notice"
      />
      <NoticeInner
        initialNotices={initialNotices}
      />
    </div>
  );
}

function NoticeInner({
  initialNotices,
}: {
  initialNotices: any[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notices, setNotices] = useState<any[]>(initialNotices);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch<any[]>("/api/notices");
        if (!cancelled && Array.isArray(res) && res.length) setNotices(res);
      } catch {
        // fallback to bundled data
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = notices.filter(n => {
    if (selectedCategory !== "All" && n.category !== selectedCategory) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const urgentNotices = notices.filter(n => n.urgent);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#1A0A02] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-[#D4A857]/70 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4A857]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4A857]">Notice Board</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#D4A857] to-[#C8860A] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-7 h-7 text-[#1A0A02]" />
            </div>
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: "2.2rem", fontWeight: 700 }}>Admission Notice Board</h1>
              <p className="text-white/60">Stay updated with the latest admission notices, results, deadlines and circulars from all universities.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Notices Banner */}
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm" style={{ fontWeight: 600 }}>🔴 Urgent Notices ({urgentNotices.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {urgentNotices.map(n => (
              <button
                key={n.id}
                onClick={() => setExpandedId(n.id)}
                className="px-3 py-1.5 bg-red-100 border border-red-200 text-red-700 text-xs rounded-lg hover:bg-red-200 transition-colors text-left max-w-xs truncate"
              >
                {n.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Search */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B3A1F]/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notices..."
                  className="w-full bg-[#FFF8F0] border border-[#D4A857]/30 rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1A0A02] focus:outline-none focus:border-[#C8860A]"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-[#D4A857]/20 rounded-2xl overflow-hidden">
              <div className="bg-[#1A0A02] px-4 py-3">
                <p className="text-[#D4A857] text-sm" style={{ fontWeight: 600 }}>Filter by Category</p>
              </div>
              <div className="p-3 space-y-1">
                {categories.map(cat => {
                  const count = cat === "All" ? notices.length : notices.filter(n => n.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                        selectedCategory === cat
                          ? "bg-[#C8860A] text-white"
                          : "text-[#6B3A1F] hover:bg-[#FFF8F0]"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat ? "bg-white/20 text-white" : "bg-[#D4A857]/10 text-[#C8860A]"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subscribe */}
            <div className="bg-gradient-to-br from-[#1A0A02] to-[#3B1A0A] rounded-2xl p-5 text-center">
              <Bell className="w-8 h-8 text-[#D4A857] mx-auto mb-3" />
              <h3 className="text-white text-sm mb-2" style={{ fontWeight: 600 }}>Never Miss a Notice</h3>
              <p className="text-white/60 text-xs mb-4">Get instant SMS & email alerts for new admission notices.</p>
              <input
                type="tel"
                placeholder="Your phone number"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#D4A857]/60 mb-3"
              />
              <button className="w-full py-2.5 bg-gradient-to-r from-[#D4A857] to-[#C8860A] text-[#1A0A02] rounded-xl text-sm" style={{ fontWeight: 600 }}>
                Subscribe Alerts
              </button>
            </div>
          </div>

          {/* Notice List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[#6B3A1F]/70 text-sm">
                <span className="text-[#1A0A02]" style={{ fontWeight: 600 }}>{filtered.length}</span> notices found
              </p>
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-[#C8860A] text-sm hover:text-[#D4A857] transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="space-y-3">
              {filtered.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div
                    className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                      notice.urgent ? "border-red-200" : "border-[#D4A857]/20"
                    } ${expandedId === notice.id ? "shadow-md" : "hover:shadow-sm"}`}
                  >
                    {notice.urgent && (
                      <div className="bg-red-500 text-white text-center py-1 text-xs">
                        🔴 Urgent Notice
                      </div>
                    )}
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs ${categoryColors[notice.category] || "bg-gray-100 text-gray-700"}`}>
                              {notice.category}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-[#6B3A1F]/50">
                              <Calendar className="w-3 h-3" />
                              {notice.date}
                            </div>
                          </div>
                          <h3 className="text-[#1A0A02] text-sm leading-snug" style={{ fontWeight: 600 }}>{notice.title}</h3>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-[#C8860A] flex-shrink-0 transition-transform ${expandedId === notice.id ? "rotate-90" : ""}`} />
                      </div>

                      {expandedId === notice.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-[#D4A857]/10"
                        >
                          <p className="text-[#6B3A1F]/70 text-sm leading-relaxed mb-4">{notice.description}</p>
                          <div className="flex items-center gap-3">
                            {notice.hasPDF && (
                              <button className="flex items-center gap-2 px-4 py-2 bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#C8860A] rounded-xl text-sm hover:bg-[#D4A857]/20 transition-all">
                                <Download className="w-4 h-4" />
                                Download PDF
                              </button>
                            )}
                            <Link
                              to="/admission-bondu"
                              className="flex items-center gap-2 px-4 py-2 bg-[#C8860A] text-white rounded-xl text-sm"
                            >
                              Get Help Applying
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#D4A857]/20">
                <Bell className="w-10 h-10 text-[#D4A857]/50 mx-auto mb-3" />
                <h3 className="text-[#1A0A02] mb-1" style={{ fontWeight: 600 }}>No Notices Found</h3>
                <p className="text-[#6B3A1F]/60 text-sm">Try changing your search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
