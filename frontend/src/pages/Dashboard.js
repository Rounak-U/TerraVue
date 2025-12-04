import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import { FaCalendarAlt, FaBookmark, FaHeadset, FaArrowRight, FaCheckCircle, FaCompass, FaPlaneDeparture, FaGlobe, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const highlightStats = [
    { label: "Upcoming Journeys", value: "03", meta: "Next trip in 12 days" },
    { label: "Saved Escapes", value: "14", meta: "+3 this week" },
    { label: "Loyalty Tier", value: "Saffron", meta: "6,200 pts" },
    { label: "Avg. Rating", value: "4.9★", meta: "128 guest reviews" }
  ];

  const heroMicroStats = [
    { label: "Concierge", value: "Online" },
    { label: "Updates", value: "2 pending" },
    { label: "Wallet", value: "₹2.1L" }
  ];

  const quickActions = [
    {
      title: "Resume Planning",
      description: "Pick up your Marrakech itinerary",
      icon: FaCompass,
      accent: "from-slate-900 via-black to-emerald-600",
      action: () => navigate("/dashboard")
    },
    {
      title: "Manage Bookings",
      description: "Confirm flights & transfers",
      icon: FaCalendarAlt,
      accent: "from-zinc-900 via-slate-800 to-gray-600",
      action: () => navigate("/profile")
    },
    {
      title: "Saved Capsules",
      description: "14 curated stays awaiting",
      icon: FaBookmark,
      accent: "from-rose-500 via-pink-500 to-orange-400",
      action: () => navigate("/dashboard")
    },
    {
      title: "Priority Support",
      description: "Ping the concierge crew",
      icon: FaHeadset,
      accent: "from-cyan-500 via-blue-600 to-indigo-700",
      action: () => navigate("/support")
    }
  ];

  const inspirationTrips = [
    {
      title: "Bali Slow Living",
      location: "Ubud · 7 nights",
      color: "from-emerald-400 via-emerald-500 to-green-600",
      detail: "Sunrise jungles, artisan food trails"
    },
    {
      title: "Swiss Glacier Rail",
      location: "Zermatt · 5 nights",
      color: "from-cyan-400 via-sky-500 to-blue-600",
      detail: "Scenic rail + private chalet tastings"
    },
    {
      title: "Dubai Sky Club",
      location: "UAE · 4 nights",
      color: "from-amber-400 via-orange-500 to-rose-500",
      detail: "Heli city circuits & desert soirees"
    }
  ];

  const journeyTimeline = [
    { step: "Dream", title: "Inspiration synced", copy: "Boards refreshed nightly", status: "done" },
    { step: "Plan", title: "Concierge refining", copy: "Custom add-ons proposed", status: "current" },
    { step: "Book", title: "Awaiting confirmation", copy: "Flights pending signature", status: "next" },
    { step: "Experience", title: "Itinerary unlocks", copy: "App shares real-time briefs", status: "upcoming" }
  ];

  const insightMetrics = [
    { label: "Travel Wallet", value: "₹2,15,500", sub: "available credit", icon: FaChartLine },
    { label: "Carbon Offset", value: "1.8T saved", sub: "this quarter", icon: FaGlobe },
    { label: "Status Alerts", value: "02", sub: "need attention", icon: FaPlaneDeparture }
  ];

  const travelPulse = [
    { area: "Flights", status: "confirmed", detail: "LHR → KEF · Seat 2A" },
    { area: "Stays", status: "finalizing", detail: "Design Loft · awaiting upgrade" },
    { area: "Experiences", status: "curating", detail: "Glacier plunge · 2 slots held" },
    { area: "Transfers", status: "ready", detail: "EV convoy · driver on standby" }
  ];

  const supportChannels = [
    "WhatsApp concierge",
    "Private voice line",
    "Share itinerary",
    "Send travel brief"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#f2f1ec] text-slate-900">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
        {/* hero */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-black via-slate-900 to-slate-800 px-10 py-12 text-white"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 right-10 w-64 h-64 bg-emerald-500/25 blur-3xl" />
            <div className="absolute bottom-0 left-8 w-48 h-48 bg-white/10 blur-2xl" />
          </div>
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[0.7rem] uppercase tracking-[0.5em]">
                TerraVue capsule
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                  Welcome back{user ? `, ${user.name}` : "!"}
                </h1>
                <p className="text-lg text-white/80">
                  Seamlessly orchestrate bookings, upgrades and bespoke rituals. Everything is aligned in this minimal mission control.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/dashboard")}
                  className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-900 shadow-lg"
                >
                  Explore tours
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/profile")}
                  className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em]"
                >
                  View profile
                </motion.button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {heroMicroStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/60">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/20 bg-white/5 p-8 space-y-6">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/60">Next departure</p>
                <h3 className="text-3xl font-semibold">Aurora Ritual • Iceland</h3>
                <p className="text-white/70">22 Dec · 6 nights · Private guide</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/60">Status</p>
                  <p className="text-lg font-semibold">Ready</p>
                  <p className="text-white/70">Docs & visas synced</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/60">Upgrades</p>
                  <p className="text-lg font-semibold">2 pending</p>
                  <p className="text-white/70">Suite + heli drop</p>
                </div>
              </div>
              <div className="grid gap-3">
                {travelPulse.slice(0, 2).map((item) => (
                  <div key={item.area} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    <div>
                      <p className="uppercase text-[0.55rem] tracking-[0.4em] text-white/60">{item.area}</p>
                      <p className="text-white">{item.detail}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* overview stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlightStats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white bg-white p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.35)]">
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.meta}</p>
            </div>
          ))}
        </section>

        {/* quick actions grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {quickActions.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={cardVariants} whileHover={{ y: -4 }}>
                <div
                  onClick={card.action}
                  className="flex h-full flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_25px_60px_-50px_rgba(15,23,42,0.7)]"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.accent} text-white flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                    <p className="text-sm text-slate-500">{card.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-900">
                    open <FaArrowRight size={12} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* inspiration + timeline */}
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2.5rem] border border-white bg-white p-8 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.65)] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Spotlight escapes</p>
                <h3 className="text-3xl font-semibold">Hand-picked for your palette</h3>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-xs uppercase tracking-[0.4em] text-slate-500 hover:text-slate-900"
              >
                see catalog
              </button>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {inspirationTrips.map((trip) => (
                <div key={trip.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <div className={`mb-5 h-40 rounded-2xl bg-gradient-to-br ${trip.color} shadow-inner`} />
                  <h4 className="text-xl font-semibold">{trip.title}</h4>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{trip.location}</p>
                  <p className="mt-3 text-sm text-slate-500">{trip.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-white bg-white p-7 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.65)] space-y-5">
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Journey timeline</p>
              <div className="space-y-3">
                {journeyTimeline.map((stage) => (
                  <div
                    key={stage.step}
                    className={`flex gap-4 rounded-2xl border p-4 ${
                      stage.status === "current"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-[0.4em] min-w-[70px]">{stage.step}</div>
                    <div>
                      <p className="text-lg font-semibold">{stage.title}</p>
                      <p className={`text-sm ${stage.status === "current" ? "text-white/70" : "text-slate-500"}`}>
                        {stage.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white bg-white p-7 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.65)] space-y-4">
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Travel pulse</p>
              <div className="space-y-3">
                {travelPulse.map((item) => (
                  <div key={item.area} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{item.area}</p>
                      <p className="text-sm text-slate-700">{item.detail}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-900">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* insights + support */}
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2.5rem] border border-white bg-white p-8 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.65)] space-y-6">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Account insights</p>
            <div className="grid gap-4">
              {insightMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{metric.label}</p>
                      <p className="text-2xl font-semibold">{metric.value}</p>
                      <p className="text-sm text-slate-500">{metric.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
              Export ledgers or invite collaborators to your travel workspace.
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-gradient-to-br from-black via-slate-900 to-slate-800 p-8 text-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <FaHeadset size={24} />
              </div>
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/60">Concierge desk</p>
                <h3 className="text-3xl font-semibold">We're online 24/7</h3>
              </div>
            </div>
            <p className="text-sm text-white/80">
              Need bespoke dining, wardrobe notes or visa intel? Your dedicated crew responds in minutes.
            </p>
            <div className="space-y-3 text-sm text-white/80">
              {supportChannels.map((channel) => (
                <div key={channel} className="flex items-center justify-between rounded-2xl border border-white/15 px-4 py-3">
                  <span className="uppercase tracking-[0.4em]">{channel}</span>
                  <FaArrowRight />
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/support")}
              className="w-full rounded-full bg-white py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-900"
            >
              contact support
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
