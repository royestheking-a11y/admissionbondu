import { useState, useEffect } from "react";
import { useNavigate, Link, ScrollRestoration } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Users, FileText, CheckCircle, Clock,
  AlertCircle, Search, Filter, MoreVertical, GraduationCap,
  LogOut, ArrowLeft, Menu, X, TrendingUp, DollarSign,
  ChevronRight, Bell, Settings, Eye, Edit, Plus, Globe, 
  MapPin, BookOpen, Hotel, ShieldCheck, Trash2, Save, Download
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { universities as initialUniversities } from "../data/universities";
import { initialNotices } from "../data/notices";
import { initialCityData, initialAccomTypes } from "../data/accommodation";
import { uploadToCloudinary } from "../lib/cloudinary";

export default function Admin() {
  const { user, isLoggedIn, logout, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [students, setStudents] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [accommodation, setAccommodation] = useState<any>({});
  const [medical, setMedical] = useState<any[]>([]);

  // Security Guard & Initialization
  useEffect(() => {
    if (!isLoggedIn || user?.role !== "admin") {
      navigate("/admin/login");
    } else {
      initializeAndLoadData();
    }
  }, [isLoggedIn, user]);

  const initializeAndLoadData = async () => {
    try {
      const [studentsRes, unisRes, appsRes, noticesRes, accomRes, medRes] = await Promise.all([
        apiFetch<any[]>("/api/users", { token }),
        apiFetch<any[]>("/api/universities", { token }),
        apiFetch<any[]>("/api/applications", { token }),
        apiFetch<any[]>("/api/notices", { token }),
        apiFetch<any>("/api/accommodation", { token }),
        apiFetch<any[]>("/api/medical", { token }),
      ]);

      setStudents(studentsRes || []);
      setUniversities(unisRes?.length ? unisRes : initialUniversities);
      setApplications(appsRes || []);
      setNotices(noticesRes?.length ? noticesRes : initialNotices);
      setAccommodation(accomRes?.cityData ? accomRes.cityData : initialCityData);
      setMedical(medRes || []);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const upsertUniversity = async (item: any) => {
    if (item?._id) {
      return await apiFetch<any>(`/api/universities/${item._id}`, { method: "PUT", body: JSON.stringify(item), token });
    }
    return await apiFetch<any>(`/api/universities`, { method: "POST", body: JSON.stringify(item), token });
  };

  const deleteUniversity = async (item: any) => {
    const id = item?._id;
    if (!id) return;
    await apiFetch<any>(`/api/universities/${id}`, { method: "DELETE", token });
  };

  const upsertNotice = async (item: any) => {
    if (item?._id) {
      return await apiFetch<any>(`/api/notices/${item._id}`, { method: "PUT", body: JSON.stringify(item), token });
    }
    return await apiFetch<any>(`/api/notices`, { method: "POST", body: JSON.stringify(item), token });
  };

  const deleteNotice = async (item: any) => {
    const id = item?._id;
    if (!id) return;
    await apiFetch<any>(`/api/notices/${id}`, { method: "DELETE", token });
  };

  const deleteStudent = async (item: any) => {
    const id = item?._id;
    if (!id) return;
    await apiFetch<any>(`/api/users/${id}`, { method: "DELETE", token });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "universities", label: "Universities", icon: Globe },
    { id: "admissions", label: "Admissions", icon: FileText },
    { id: "medical", label: "Medical", icon: ShieldCheck },
    { id: "accommodation", label: "Accommodation", icon: Hotel },
    { id: "notices", label: "Notices", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!isLoggedIn || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex">
      <ScrollRestoration />
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A0A02] transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4A857] to-[#A8742C] rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#1A0A02]" />
              </div>
              <div className="leading-tight">
                <span className="text-white text-sm font-bold block">Admission Bondu</span>
                <span className="text-[#D4A857] text-[10px] font-medium tracking-wider uppercase">Admin Control</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  activeTab === item.id 
                    ? "bg-[#D4A857] text-[#1A0A02] font-semibold shadow-lg shadow-[#D4A857]/10" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Return Home
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-gray-800 font-bold text-lg capitalize">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-gray-800">{user.name}</span>
              <span className="text-[10px] text-[#D4A857] font-bold uppercase tracking-wider">System Administrator</span>
            </div>
            <div className="w-10 h-10 bg-[#1A0A02] rounded-full flex items-center justify-center border-2 border-[#D4A857]/20">
              <Users className="w-5 h-5 text-[#D4A857]" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FDFCFB]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {activeTab === "overview" && <OverviewSection students={students} applications={applications} />}
              {activeTab === "students" && <StudentsSection students={students} setStudents={setStudents} onDeleteStudent={deleteStudent} />}
              {activeTab === "universities" && <CrudSection 
                  title="University Management" 
                  data={universities} 
                  setData={setUniversities}
                  onUpsert={upsertUniversity}
                  onDelete={deleteUniversity}
                  columns={["name", "type", "city", "deadline", "tuitionMin", "tuitionMax", "diplomaFriendly"]}
                  placeholder="University Name"
              />}
              {activeTab === "admissions" && <AdmissionsSection data={applications} setData={setApplications} token={token} />}
              {activeTab === "medical" && <CrudSection 
                  title="Medical College Management" 
                  data={medical} 
                  setData={setMedical} 
                  onUpsert={upsertUniversity}
                  onDelete={deleteUniversity}
                  columns={["name", "type", "city", "seats", "tuitionMin", "tuitionMax"]}
                  placeholder="College Name"
              />}
              {activeTab === "accommodation" && <AccommodationSection data={accommodation} setData={setAccommodation} token={token} />}
              {activeTab === "notices" && <NoticesSection data={notices} setData={setNotices} onUpsert={upsertNotice} onDelete={deleteNotice} />}
              {activeTab === "settings" && <SettingsSection onReset={initializeAndLoadData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ── OVERVIEW SECTION ──────────────────────────────────────────────────────

function OverviewSection({ students, applications }: { students: any[], applications: any[] }) {
  const stats = [
    { label: "Total Students", value: students.length.toString(), icon: Users, color: "#D4A857" },
    { label: "Total Apps", value: applications.length.toString(), icon: FileText, color: "#3b82f6" },
    { label: "Pending Apps", value: applications.filter(a => a.status === "Pending").length.toString(), icon: Clock, color: "#f59e0b" },
    { label: "Success Rate", value: "88%", icon: TrendingUp, color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
            </div>
            <div className="text-2xl font-black text-gray-900">{stat.value}</div>
            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Recent Applications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-medium">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">University</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.slice(0, 5).map((app, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{app.studentName}</p>
                      <p className="text-xs text-gray-400">{app.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{app.university}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                        app.status === "Approved" ? "bg-green-50 text-green-600 border border-green-100" :
                        app.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        "bg-red-50 text-red-600 border border-red-100"
                      }`}>{app.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1A0A02] rounded-3xl p-6 text-white shadow-xl shadow-[#1A0A02]/10 relative group h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A857]/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-4 relative z-10">Admin Quick Actions</h3>
            <div className="space-y-3 relative z-10">
              <button className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-2xl flex items-center justify-between text-sm transition-all">
                <div className="flex items-center gap-3"><Bell className="w-4 h-4 text-[#D4A857]" /> Broadcast Notice</div>
                <ChevronRight className="w-4 h-4 opacity-30" />
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-2xl flex items-center justify-between text-sm transition-all">
                <div className="flex items-center gap-3"><Plus className="w-4 h-4 text-[#D4A857]" /> Create Admin Account</div>
                <ChevronRight className="w-4 h-4 opacity-30" />
              </button>
              <button className="w-full bg-[#D4A857] text-[#1A0A02] py-4 rounded-2xl font-bold mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Generate Monthly Report
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

// ── REUSABLE CRUD SECTION ────────────────────────────────────────────────

function CrudSection({
  title,
  data,
  setData,
  columns,
  placeholder,
  onUpsert,
  onDelete,
}: {
  title: string;
  data: any[];
  setData: Function;
  columns: string[];
  placeholder: string;
  onUpsert?: (item: any) => Promise<any>;
  onDelete?: (item: any) => Promise<void>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (item: any) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      if (onDelete) await onDelete(item);
      setData(data.filter((x) => (x._id || x.id || x.name) !== (item._id || item.id || item.name)));
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
  };

  const handleAdd = () => {
    const newItem = { name: `New ${placeholder}` };
    columns.forEach(col => { if(col !== 'id' && col !== 'name') (newItem as any)[col] = ""; });
    setData([newItem, ...data]);
    setEditingItem(newItem);
  };

  const handleSave = async () => {
    if (editingItem) {
      try {
        if (onUpsert) {
          const saved = await onUpsert(editingItem);
          setData(
            data.map((item) =>
              (item._id || item.id || item.name) === (editingItem._id || editingItem.id || editingItem.name)
                ? saved
                : item
            )
          );
        } else {
          setData(
            data.map((item) =>
              (item._id || item.id || item.name) === (editingItem._id || editingItem.id || editingItem.name)
                ? editingItem
                : item
            )
          );
        }
        setEditingItem(null);
      } catch (e: any) {
        alert(e?.message || "Save failed");
      }
    }
  };

  const canUploadLogo = title.toLowerCase().includes("university");
  const canUploadPdf = title.toLowerCase().includes("notice");

  const handleUpload = async (file: File, target: "logo" | "pdf") => {
    try {
      setUploading(true);
      const uploaded = await uploadToCloudinary(file);
      setEditingItem((prev: any) => {
        if (!prev) return prev;
        if (target === "logo") {
          return {
            ...prev,
            logoMedia: uploaded,
            logo: uploaded.secureUrl,
          };
        }
        return {
          ...prev,
          pdfMedia: uploaded,
          hasPDF: true,
        };
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#D4A857]/20 outline-none" 
          />
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-[#1A0A02] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#1A0A02]/10 hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
            <tr>
              {columns.map(col => <th key={col} className="px-6 py-4">{col}</th>)}
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="py-20 text-center text-gray-400">No records found.</td></tr>
            ) : (
              filteredData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map(col => (
                    <td key={col} className="px-6 py-4 text-sm text-gray-600">
                      {item[col]}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                     <div className="flex gap-2">
                       <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><Edit className="w-4 h-4 text-gray-400" /></button>
                       <button onClick={() => void handleDelete(item)} className="p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4 text-red-300" /></button>
                     </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingItem(null)} className="absolute inset-0 bg-[#1A0A02]/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Edit {placeholder}</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <div className="p-6 space-y-4">
                {columns.map(col => (
                  <div key={col}>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">{col}</label>
                    <input 
                      type="text" 
                      value={editingItem[col] || ""} 
                      onChange={(e) => setEditingItem({ ...editingItem, [col]: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#D4A857] outline-none" 
                    />
                  </div>
                ))}

                {canUploadLogo && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">logo_upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleUpload(f, "logo");
                      }}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#D4A857] outline-none"
                    />
                    {editingItem?.logo && (
                      <div className="mt-3 flex items-center gap-3">
                        <img src={editingItem.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                        <div className="text-xs text-gray-500 break-all">{editingItem.logo}</div>
                      </div>
                    )}
                  </div>
                )}

                {canUploadPdf && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">pdf_upload</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleUpload(f, "pdf");
                      }}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#D4A857] outline-none"
                    />
                    {editingItem?.pdfMedia?.secureUrl && (
                      <div className="mt-2 text-xs text-gray-500 break-all">{editingItem.pdfMedia.secureUrl}</div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-6 bg-gray-50 overflow-hidden flex gap-3">
                <button onClick={() => setEditingItem(null)} className="flex-1 py-3 px-6 bg-white border border-gray-200 text-gray-600 rounded-2xl text-sm font-bold">Cancel</button>
                <button onClick={handleSave} className="flex-[2] py-3 px-6 bg-[#1A0A02] text-[#D4A857] rounded-2xl text-sm font-bold">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SPECIALIZED SECTIONS ──────────────────────────────────────────────────

function StudentsSection({
  students,
  setStudents,
  onDeleteStudent,
}: {
  students: any[];
  setStudents: Function;
  onDeleteStudent: (item: any) => Promise<void>;
}) {
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const handleDelete = async (student: any) => {
    if (!window.confirm("Delete this student account?")) return;
    try {
      await onDeleteStudent(student);
      setStudents(students.filter((s) => (s._id || s.email) !== (student._id || student.email)));
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="font-bold text-gray-800">Verified Students</h2>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left font-medium">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Academic Details</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-center">Docs</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1A0A02] rounded-2xl flex items-center justify-center text-[#D4A857] font-bold text-xs uppercase">{s.name ? s.name[0] : "S"}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{s.name}</p>
                    <p className="text-[10px] text-[#D4A857] font-bold">{s.studentId}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-600">SSC: {s.sscGpa || "N/A"} | HSC: {s.hscGpa || "N/A"}</span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{s.email}<br />{s.phone}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => setSelectedStudent(s)}
                    className="p-2.5 bg-[#D4A857]/10 text-[#A8742C] rounded-xl hover:bg-[#D4A857]/20 transition-all relative"
                  >
                    <FileText className="w-4 h-4" />
                    {s.documents?.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white">
                        {s.documents.length}
                      </span>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => void handleDelete(s)} className="p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4 text-red-300" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStudent(null)} className="absolute inset-0 bg-[#1A0A02]/60 backdrop-blur-sm" />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.95 }} 
               className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">Student Documents</h3>
                  <p className="text-xs text-gray-400">{selectedStudent.name} ({selectedStudent.studentId})</p>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {(!selectedStudent.documents || selectedStudent.documents.length === 0) ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No documents uploaded</p>
                  </div>
                ) : (
                  selectedStudent.documents.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#C8860A]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{doc.name}</p>
                          <p className="text-[10px] text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <a 
                           href={doc.url} 
                           target="_blank" 
                           rel="noreferrer"
                           className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-[#D4A857] transition-all"
                         >
                           <Eye className="w-4 h-4" />
                         </a>
                         <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                           doc.status === "Verified" ? "bg-green-100 text-green-700" :
                           doc.status === "Pending" ? "bg-amber-100 text-amber-700" :
                           "bg-red-100 text-red-700"
                         }`}>{doc.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-6 bg-gray-50 text-center">
                <button onClick={() => setSelectedStudent(null)} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Close Viewer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdmissionsSection({ data, setData, token }: { data: any[], setData: Function, token: string | null }) {
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const updateStatus = (id: string, status: string) => {
    let progress = 20;
    if (status === "Approved") progress = 100;
    if (status === "Rejected") progress = 0;
    if (status === "Processing") progress = 60;

    setData(data.map(app => {
      if (app.id === id) {
        const updatedSteps = (app.steps || []).map((step: any, idx: number) => {
           if (status === "Approved") return { ...step, done: true };
           if (idx === 0) return { ...step, done: true }; // Application always done
           if (status === "Processing" && idx <= 2) return { ...step, done: true };
           return step;
        });

        const updatedApp = { 
          ...app, 
          status, 
          progress, 
          lastUpdate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          steps: updatedSteps
        };
        void apiFetch(`/api/applications/${app._id || app.id}`, {
          method: "PUT",
          body: JSON.stringify({
            status,
            progress,
            lastUpdate: updatedApp.lastUpdate,
            steps: updatedSteps,
          }),
          token,
        }).catch(() => {});
        return updatedApp;
      }
      return app;
    }));
  };

  const downloadCSV = () => {
    const headers = ["App ID", "Student Name", "Email", "Phone", "GPA", "Subject", "University", "Package", "Status", "Date"];
    const rows = data.map(app => [
      app.id,
      app.studentName,
      app.studentEmail,
      app.phone,
      app.gpa,
      app.subject,
      (app.universities || []).join(" | "),
      app.package,
      app.status,
      app.submittedDate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admissions_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="font-bold text-gray-800">Application Management</h2>
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4A857]/10 text-[#A8742C] rounded-2xl text-sm font-bold hover:bg-[#D4A857]/20 transition-all"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
        <table className="w-full text-left font-medium">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">App ID</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">University</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr><td colSpan={5} className="py-20 text-center text-gray-400 italic">No applications found.</td></tr>
            ) : (
              data.map((app, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors text-sm">
                  <td className="px-6 py-4 font-bold text-gray-400">{app.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-gray-800 font-bold">{app.studentName}</p>
                    <p className="text-[10px] text-gray-400">{app.studentEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(app.universities || []).map((u: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold rounded-md whitespace-nowrap">
                          {u}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                        value={app.status} 
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border-none ring-1 outline-none ${
                          app.status === "Approved" ? "bg-green-50 text-green-600 ring-green-100" : 
                          app.status === "Pending" ? "bg-amber-50 text-amber-600 ring-amber-100" : 
                          app.status === "Processing" ? "bg-blue-50 text-blue-600 ring-blue-100" :
                          "bg-red-50 text-red-600 ring-red-100"
                        }`}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="p-2.5 hover:bg-[#D4A857]/10 rounded-xl transition-all group"
                    >
                      <Eye className="w-5 h-5 text-gray-400 group-hover:text-[#A8742C]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-[#1A0A02]/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 text-left">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">Application Details</h3>
                  <p className="text-xs text-gray-400">Reference ID: {selectedApp.id}</p>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              
              <div className="p-8 grid md:grid-cols-2 gap-8 max-h-[65vh] overflow-y-auto text-left">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-[#D4A857] font-bold mb-3">Student Profile</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Full Name</p>
                        <p className="text-sm font-bold text-gray-700">{selectedApp.studentName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                           <p className="text-sm font-bold text-gray-700">{selectedApp.phone}</p>
                         </div>
                         <div>
                           <p className="text-xs text-gray-400 mb-1">SSC + HSC GPA</p>
                           <p className="text-sm font-bold text-gray-700">{selectedApp.gpa}</p>
                         </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Email Address</p>
                        <p className="text-sm font-bold text-gray-700">{selectedApp.studentEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-[#D4A857] font-bold mb-3">Academic Background</h4>
                    <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400 mb-0.5">SSC Roll</p>
                            <p className="text-xs font-bold text-gray-700">{selectedApp.sscRoll || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 mb-0.5">HSC Roll</p>
                            <p className="text-xs font-bold text-gray-700">{selectedApp.hscRoll || "N/A"}</p>
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] text-gray-400 mb-0.5">Registration Number</p>
                          <p className="text-xs font-bold text-gray-700">{selectedApp.regNumber || "N/A"}</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-[#D4A857] font-bold mb-3">Submission Details</h4>
                    <div className="bg-[#FFF8F0] p-5 rounded-3xl border border-[#D4A857]/10 space-y-4">
                      <div>
                        <p className="text-xs text-[#A8742C]/60 mb-1">Target Universities & Subject</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                           {(selectedApp.universities || []).map((u: string, idx: number) => (
                             <span key={idx} className="px-3 py-1 bg-white border border-[#D4A857]/20 text-[#1A0A02] text-xs font-bold rounded-xl shadow-sm">
                               {u}
                             </span>
                           ))}
                        </div>
                        <p className="text-sm font-bold text-[#1A0A02]">Subject: {selectedApp.subject}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-[#A8742C]/60 mb-1">Selected Package</p>
                          <span className="px-3 py-1 bg-[#D4A857] text-[#1A0A02] text-[10px] font-bold rounded-lg uppercase">{selectedApp.package}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#A8742C]/60 mb-1">Date Submitted</p>
                          <p className="text-xs font-bold text-[#1A0A02]">{selectedApp.submittedDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-[#D4A857] font-bold mb-3">Payment Verification</h4>
                    <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm">
                       <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                          <p className="text-xs text-gray-400">Method</p>
                          <p className="text-sm font-bold text-gray-700">{selectedApp.paymentMethod || "bKash"}</p>
                       </div>
                       <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">Transaction ID</p>
                          <p className="text-sm font-bold text-[#D4A857] font-mono">{selectedApp.transactionId || "N/A"}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => {
                    const printContent = `
                      ADMISSION BONDU - APPLICATION SUMMARY
                      --------------------------------------
                      Reference ID: ${selectedApp.id}
                      Date: ${selectedApp.submittedDate}
                      
                      STUDENT INFO
                      Name: ${selectedApp.studentName}
                      Email: ${selectedApp.studentEmail}
                      Phone: ${selectedApp.phone}
                      GPA: ${selectedApp.gpa}
                      
                      ACADEMIC CREDENTIALS
                      SSC Roll: ${selectedApp.sscRoll}
                      HSC Roll: ${selectedApp.hscRoll}
                      Reg No: ${selectedApp.regNumber}
                      
                      APPLICATION
                      Universities: ${(selectedApp.universities || []).join(", ")}
                      Subject: ${selectedApp.subject}
                      Package: ${selectedApp.package}
                      
                      PAYMENT INFO
                      Method: ${selectedApp.paymentMethod}
                      Trx ID: ${selectedApp.transactionId}
                      
                      STATUS: ${selectedApp.status.toUpperCase()}
                    `;
                    const blob = new Blob([printContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Application_${selectedApp.id}.txt`;
                    link.click();
                  }}
                  className="flex-1 py-4 px-6 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all shadow-sm"
                >
                  Download Info (.txt)
                </button>
                <button onClick={() => setSelectedApp(null)} className="flex-1 py-4 px-6 bg-[#1A0A02] text-[#D4A857] rounded-2xl text-sm font-bold shadow-lg">Close Details</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NoticesSection({
  data,
  setData,
  onUpsert,
  onDelete,
}: {
  data: any[];
  setData: Function;
  onUpsert: (item: any) => Promise<any>;
  onDelete: (item: any) => Promise<void>;
}) {
  return (
    <CrudSection
      title="Notice Management"
      data={data}
      setData={setData}
      onUpsert={onUpsert}
      onDelete={onDelete}
      columns={["title", "category", "date", "urgent", "hasPDF", "description"]}
      placeholder="Notice"
    />
  );
}

function AccommodationSection({ data, setData, token }: { data: any, setData: Function, token: string | null }) {
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const handleEdit = (city: string) => {
    setEditingCity(city);
    setFormData({ ...data[city] });
  };

  const handleAdd = () => {
    const newCityKey = "New City " + Date.now();
    const newCity = {
      name: "New City",
      lifestyle: {
        budget: { rent: 0, food: 0, transport: 0, utilities: 0 },
        standard: { rent: 0, food: 0, transport: 0, utilities: 0 },
        premium: { rent: 0, food: 0, transport: 0, utilities: 0 },
      },
      hostelRent: { min: 0, max: 0 },
      privateRent: { min: 0, max: 0 },
      description: "",
    };
    // We add it to the data then open the edit modal immediately
    const newData = { ...data, [newCityKey]: newCity };
    setData(newData);
    setEditingCity(newCityKey);
    setFormData(newCity);
    void apiFetch("/api/accommodation", {
      method: "PUT",
      body: JSON.stringify({ cityData: newData, accomTypes: initialAccomTypes }),
      token,
    }).catch(() => {});
  };

  const handleDelete = (city: string) => {
    if (window.confirm(`Are you sure you want to delete ${city}?`)) {
      const newData = { ...data };
      delete newData[city];
      setData(newData);
      void apiFetch("/api/accommodation", {
        method: "PUT",
        body: JSON.stringify({ cityData: newData, accomTypes: initialAccomTypes }),
        token,
      }).catch(() => {});
    }
  };

  const handleSave = () => {
    if (editingCity && formData) {
      // If name changed, we need to handle the key swap
      const newData = { ...data };
      delete newData[editingCity];
      newData[formData.name || editingCity] = formData;
      setData(newData);
      void apiFetch("/api/accommodation", {
        method: "PUT",
        body: JSON.stringify({ cityData: newData, accomTypes: initialAccomTypes }),
        token,
      }).catch(() => {});
      setEditingCity(null);
      setFormData(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-[#1A0A02] text-white rounded-2xl text-sm font-bold shadow-lg">
          <Plus className="w-4 h-4" /> Add New City
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data).map(([city, costs]: [string, any]) => (
          <div key={city} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A0A02]">{city}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(city)} className="text-[#D4A857] p-2 hover:bg-[#D4A857]/10 rounded-xl transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(city)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Standard Rent</span>
                <span className="text-gray-800 font-bold">{costs.lifestyle.standard.rent} BDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Standard</span>
                <span className="text-gray-800 font-bold">
                  {costs.lifestyle.standard.rent + costs.lifestyle.standard.food + costs.lifestyle.standard.transport + costs.lifestyle.standard.utilities} BDT
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-50">
                <span className="text-gray-400">Hostel Range</span>
                <span className="text-gray-800 text-xs font-medium">{costs.hostelRent.min}-{costs.hostelRent.max} BDT</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCity && formData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setEditingCity(null)}
              className="absolute inset-0 bg-[#1A0A02]/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="font-bold text-gray-800 text-lg">Edit Costs: {editingCity}</h3>
                <button onClick={() => setEditingCity(null)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#D4A857]/20 outline-none h-24 resize-none"
                    placeholder="Short description of the city..."
                  />
                </div>

                {/* Hostels & Private Rent */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Hostel Rent (Min-Max)</label>
                    <div className="flex gap-2">
                      <input type="number" value={formData.hostelRent.min} onChange={(e) => setFormData({ ...formData, hostelRent: { ...formData.hostelRent, min: Number(e.target.value) }})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#D4A857] outline-none" />
                      <input type="number" value={formData.hostelRent.max} onChange={(e) => setFormData({ ...formData, hostelRent: { ...formData.hostelRent, max: Number(e.target.value) }})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#D4A857] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Private Rent (Min-Max)</label>
                    <div className="flex gap-2">
                      <input type="number" value={formData.privateRent.min} onChange={(e) => setFormData({ ...formData, privateRent: { ...formData.privateRent, min: Number(e.target.value) }})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#D4A857] outline-none" />
                      <input type="number" value={formData.privateRent.max} onChange={(e) => setFormData({ ...formData, privateRent: { ...formData.privateRent, max: Number(e.target.value) }})} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#D4A857] outline-none" />
                    </div>
                  </div>
                </div>

                {/* Lifestyles */}
                {["budget", "standard", "premium"].map((type) => (
                  <div key={type} className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-700 capitalize text-sm flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${type === 'budget' ? 'bg-blue-400' : type === 'standard' ? 'bg-[#D4A857]' : 'bg-purple-400'}`} />
                      {type} Lifestyle
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["rent", "food", "transport", "utilities"].map((field) => (
                        <div key={field}>
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{field}</label>
                          <input 
                            type="number"
                            value={formData.lifestyle[type][field]}
                            onChange={(e) => {
                              const newList = { ...formData.lifestyle };
                              newList[type][field] = Number(e.target.value);
                              setFormData({ ...formData, lifestyle: newList });
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#D4A857] outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => setEditingCity(null)}
                  className="flex-1 py-3 px-6 bg-white border border-gray-200 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-[2] py-3 px-6 bg-[#1A0A02] text-[#D4A857] rounded-2xl text-sm font-bold shadow-lg shadow-[#1A0A02]/20 hover:opacity-90 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsSection({ onReset }: { onReset: () => void }) {
  const handleReset = () => {
    if (window.confirm("CRITICAL: This will wipe all manual changes and reload default static data. Proceed?")) {
      localStorage.clear();
      onReset();
      alert("System restored to default data.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6">System Settings</h2>
        <div className="space-y-6">
           <div className="flex items-center justify-between p-6 bg-red-50 rounded-3xl border border-red-100">
              <div>
                 <h4 className="font-bold text-red-700">Factory Reset Database</h4>
                 <p className="text-sm text-red-500 opacity-80">Wipe all local storage data and reload from code constants.</p>
              </div>
              <button 
                onClick={handleReset}
                className="px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-600/10 hover:bg-red-700 transition-all"
              >
                Reset System
              </button>
           </div>
           <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 opacity-50 cursor-not-allowed">
              <div>
                 <h4 className="font-bold text-gray-700">Backup Cloud Sync</h4>
                 <p className="text-sm text-gray-500">Scheduled automated backups to cloud storage.</p>
              </div>
              <button disabled className="px-6 py-3 bg-gray-300 text-white rounded-2xl text-sm font-bold">Enabled</button>
           </div>
        </div>
    </div>
  );
}
