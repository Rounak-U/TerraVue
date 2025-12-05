import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChartLine,
  FaCompass,
  FaGlobeAmericas,
  FaHeadset,
  FaHeart,
  FaShoppingCart,
  FaSuitcaseRolling,
  FaTicketAlt
} from "react-icons/fa";
import DashboardNavbar from "../components/DashboardNavbar";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { toursData } from "../data/tours";

const statusStyles = {
  confirmed: "text-emerald-600 bg-emerald-50 border-emerald-200",
  completed: "text-slate-600 bg-slate-100 border-slate-200",
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  cancelled: "text-rose-600 bg-rose-50 border-rose-200"
};

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { cartCount, totals, cart } = useCart();

  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingRes, favoriteRes, supportRes, tourRes] = await Promise.allSettled([
        api.get("/api/bookings/my-bookings"),
        api.get("/api/favorites"),
        api.get("/api/support"),
        api.get("/api/tours?limit=4")
      ]);

      setBookings(bookingRes.status === "fulfilled" ? bookingRes.value.data || [] : []);
      setFavorites(favoriteRes.status === "fulfilled" ? favoriteRes.value.data?.favorites || [] : []);
      setTickets(supportRes.status === "fulfilled" ? supportRes.value.data?.tickets || [] : []);

      if (tourRes.status === "fulfilled") {
        const payload = Array.isArray(tourRes.value.data)
          ? tourRes.value.data
          : tourRes.value.data?.tours || [];
        setFeaturedTours(payload.slice(0, 4));
      } else {
        setFeaturedTours(toursData.slice(0, 4));
      }
    } catch (err) {
      setError("Unable to refresh dashboard right now.");
      setBookings([]);
      setFavorites([]);
      setTickets([]);
      setFeaturedTours(toursData.slice(0, 4));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: totals.currency || "INR",
        maximumFractionDigits: 0
      }),
    [totals.currency]
  );

  const formatAmount = useCallback((value = 0) => currencyFormatter.format(value || 0), [currencyFormatter]);

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return value;
    }
  };

  const formatRange = (booking) => {
    if (!booking?.startDate) return "Not scheduled";
    if (!booking?.endDate) return formatDate(booking.startDate);
    return `${formatDate(booking.startDate)} · ${formatDate(booking.endDate)}`;
  };

  const badgeInitials = useCallback((value) => {
    if (!value) return "TR";
    return value.toString().slice(0, 2).toUpperCase();
  }, []);

  const latestTicketMessage = useCallback((ticket) => {
    if (!ticket) return "";
    const history = ticket.messages || [];
    if (history.length) {
      return history[history.length - 1]?.body || ticket.message || "";
    }
    return ticket.message || "";
  }, []);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const aDate = new Date(a.startDate || a.createdAt || 0).getTime();
      const bDate = new Date(b.startDate || b.createdAt || 0).getTime();
      return aDate - bDate;
    });
  }, [bookings]);

  const nextJourney = useMemo(() => {
    const upcoming = sortedBookings.find((booking) => booking.startDate && new Date(booking.startDate) >= new Date());
    return upcoming || sortedBookings[0] || null;
  }, [sortedBookings]);

  const bookingSpend = useMemo(
    () => bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0),
    [bookings]
  );

  const openTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status && ticket.status !== "Resolved"),
    [tickets]
  );

  const favoriteCategories = useMemo(() => {
    const set = new Set();
    favorites.forEach((fav) => {
      const category = fav.category || fav?.tour?.category;
      if (category) set.add(category);
    });
    return set.size;
  }, [favorites]);

  const heroMicroStats = [
    { label: "Cart", value: cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""}` : "Cart empty" },
    { label: "Support", value: openTickets.length ? `${openTickets.length} open` : "All clear" },
    { label: "Spend", value: formatAmount(bookingSpend) }
  ];

  const loyaltyProgress = Math.min(100, Math.round((bookingSpend / 200000) * 100));
  const wishlistProgress = Math.min(100, favorites.length * 20);
  const supportPulse = Math.max(0, 100 - openTickets.length * 20);

  const highlightStats = useMemo(
    () => [
      {
        label: "Journeys booked",
        value: bookings.length,
        meta: nextJourney ? `Next: ${formatDate(nextJourney.startDate)}` : "No trips confirmed",
        icon: FaCalendarAlt,
        accent: "from-emerald-500/90 via-emerald-500/70 to-emerald-600/80",
        progress: Math.min(100, bookings.length ? bookings.length * 18 : nextJourney ? 60 : 20)
      },
      {
        label: "Cart total",
        value: formatAmount(totals.subtotal || 0),
        meta: cartCount ? `${cartCount} items saved` : "Hold seats from any tour",
        icon: FaShoppingCart,
        accent: "from-blue-600/90 via-indigo-600/80 to-slate-900/80",
        progress: Math.min(100, cartCount ? cartCount * 25 : 30)
      },
      {
        label: "Saved tours",
        value: favorites.length,
        meta: favoriteCategories ? `${favoriteCategories} categories` : "Add tours to favourites",
        icon: FaHeart,
        accent: "from-rose-500/90 via-pink-500/80 to-orange-500/70",
        progress: Math.min(100, favorites.length ? favorites.length * 15 : 15)
      },
      {
        label: "Support tickets",
        value: tickets.length,
        meta: openTickets.length ? `${openTickets.length} open` : "All resolved",
        icon: FaHeadset,
        accent: "from-cyan-500/90 via-blue-600/80 to-indigo-700/70",
        progress: Math.max(10, supportPulse)
      }
    ],
    [
      bookings.length,
      nextJourney,
      formatAmount,
      totals.subtotal,
      cartCount,
      favorites.length,
      favoriteCategories,
      tickets.length,
      openTickets.length,
      supportPulse
    ]
  );

  const quickActions = [
    {
      title: "Manage bookings",
      description: bookings.length ? `${bookings.length} journeys tracked` : "Add your first itinerary",
      icon: FaCalendarAlt,
      accent: "from-slate-900 via-slate-800 to-gray-700",
      action: () => navigate("/bookings")
    },
    {
      title: "View cart",
      description: cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""} ready` : "Cart is empty",
      icon: FaShoppingCart,
      accent: "from-emerald-500 via-emerald-600 to-emerald-800",
      action: () => navigate("/cart")
    },
    {
      title: "Saved tours",
      description: favorites.length ? `${favorites.length} favourites` : "Heart a tour to store it",
      icon: FaHeart,
      accent: "from-rose-500 via-pink-500 to-orange-400",
      action: () => navigate("/favourites")
    },
    {
      title: "Support",
      description: openTickets.length ? `${openTickets.length} open tickets` : "Ask us anything",
      icon: FaHeadset,
      accent: "from-cyan-500 via-blue-600 to-indigo-700",
      action: () => navigate("/support-center")
    }
  ];

  const travelInsights = useMemo(
    () => [
      {
        title: "Loyalty status",
        description: "Spend towards complimentary upgrades",
        metric: formatAmount(bookingSpend),
        footer: loyaltyProgress >= 100 ? "Gold tier unlocked" : `${Math.max(0, 100 - loyaltyProgress)}% to Gold`,
        progress: loyaltyProgress,
        accent: "from-amber-500/80 via-orange-500/70 to-rose-500/60",
        icon: FaChartLine
      },
      {
        title: "Wishlist depth",
        description: "Saved experiences curated in favourites",
        metric: `${favorites.length} saved`,
        footer: favoriteCategories ? `${favoriteCategories} styles collected` : "Add diverse tours",
        progress: wishlistProgress,
        accent: "from-fuchsia-500/60 via-purple-500/60 to-indigo-500/60",
        icon: FaGlobeAmericas
      },
      {
        title: "Support health",
        description: "Tickets resolved vs. open",
        metric: `${tickets.length} total`,
        footer: openTickets.length ? `${openTickets.length} awaiting replies` : "Inbox is calm",
        progress: supportPulse,
        accent: "from-cyan-500/70 via-teal-500/70 to-emerald-500/60",
        icon: FaSuitcaseRolling
      }
    ],
    [
      bookingSpend,
      favorites.length,
      favoriteCategories,
      tickets.length,
      openTickets.length,
      loyaltyProgress,
      wishlistProgress,
      supportPulse,
      formatAmount
    ]
  );

  const journeyFactGrid = [
    {
      label: "Status",
      value: nextJourney?.status || "N/A"
    },
    {
      label: "Guests",
      value: nextJourney
        ? `${nextJourney.adults} adult${nextJourney.adults > 1 ? "s" : ""}${
            nextJourney.children
              ? ` · ${nextJourney.children} child${nextJourney.children > 1 ? "ren" : ""}`
              : ""
          }`
        : "—"
    },
    {
      label: "Payment",
      value: nextJourney ? nextJourney.paymentStatus || "—" : "—"
    },
    {
      label: nextJourney ? "Destination" : "Planner tip",
      value: nextJourney
        ? nextJourney.tour?.country || nextJourney.tour?.title || "—"
        : "Save a tour to curate ideas"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const bookingPreview = sortedBookings.slice(0, 3);
  const favoritePreview = favorites.slice(0, 3);
  const supportPreview = tickets.slice(0, 3);
  const cartPreview = (cart?.items || []).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f2f1ec] text-slate-900">
      <DashboardNavbar />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-6 -left-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-[130px]" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-200/50 blur-[150px]" />
        </div>
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#05070d] via-[#0d1426] to-[#111b33] px-10 py-14 text-white shadow-[0_60px_140px_-80px_rgba(5,6,21,1)]"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-28 right-4 h-72 w-72 rounded-full bg-emerald-500/30 blur-[150px]" />
            <div className="absolute -bottom-16 -left-12 h-80 w-80 rounded-full bg-blue-500/25 blur-[150px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
          </div>
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.4fr_0.8fr] items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[0.65rem] uppercase tracking-[0.5em]">
                TerraVue capsule
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl text-start font-semibold leading-tight">
                  {user ? `Welcome, ${user.name}` : "Welcome back"}
                </h1>
                <p className="text-lg text-white/80">
                  {nextJourney
                    ? `You're set for ${nextJourney.tour?.title || "your next journey"}. Keep tabs on documents, seats, and upgrades right here.`
                    : "Confirm a tour to see the live journey tracker update in real time."}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => (nextJourney ? navigate("/bookings") : navigate("/explore-tours"))}
                  className="rounded-2xl bg-white/95 px-10 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.7)]"
                >
                  {nextJourney ? "Manage booking" : "Explore tours"}
                </button>
                <button
                  onClick={loadDashboard}
                  className="rounded-2xl border border-white/40 px-10 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-white/90"
                >
                  Refresh data
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {heroMicroStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/60">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/20 bg-white/5 p-8 space-y-8 backdrop-blur">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/60">{nextJourney ? "Next departure" : "No journeys yet"}</p>
                <h3 className="text-3xl font-semibold">
                  {nextJourney ? nextJourney.tour?.title || "Custom journey" : "Add a booking"}
                </h3>
                <p className="text-white/70">
                  {nextJourney ? `${nextJourney.tour?.country || "—"} • ${formatRange(nextJourney)}` : "Select a tour to get started."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {journeyFactGrid.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/15 bg-black/25 p-4">
                    <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/60">{item.label}</p>
                    <p className="text-base font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-2">
          {highlightStats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br ${stat.accent} p-6 text-white shadow-[0_40px_120px_-80px_rgba(5,6,21,1)]`}
              >
                <div className="absolute inset-0 opacity-25">
                  <div className="absolute -right-10 top-8 h-40 w-40 rounded-full border border-white/25" />
                  <div className="absolute -bottom-10 left-4 h-32 w-32 rounded-full bg-white/15 blur-3xl" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/70">{stat.label}</p>
                      <p className="text-4xl font-semibold leading-tight">{stat.value}</p>
                      <p className="text-sm text-white/80">{stat.meta}</p>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3">
                      <StatIcon className="text-xl" />
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white" style={{ width: `${stat.progress}%` }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-3">
          {travelInsights.map((insight) => {
            const InsightIcon = insight.icon;
            return (
              <div
                key={insight.title}
                className="relative rounded-[2.5rem] border border-slate-100/60 bg-white/80 p-6 shadow-[0_35px_120px_-80px_rgba(15,23,42,0.6)] backdrop-blur"
              >
                <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${insight.accent} opacity-30`} />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">{insight.title}</p>
                      <p className="text-2xl font-semibold text-slate-900">{insight.metric}</p>
                      <p className="text-sm text-slate-500">{insight.description}</p>
                    </div>
                    <div className="rounded-2xl bg-white/80 p-3 text-slate-800 shadow-sm">
                      <InsightIcon className="text-xl" />
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-slate-900" style={{ width: `${insight.progress}%` }} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{insight.footer}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2.5rem] bg-white/90 border border-slate-100 p-6 shadow-[0_30px_100px_-80px_rgba(15,23,42,0.55)] backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Itineraries</p>
                <h3 className="text-2xl font-semibold">Recent bookings</h3>
              </div>
              <button onClick={() => navigate("/bookings")} className="inline-flex items-center text-sm font-semibold text-slate-900">
                View all
                <FaArrowRight className="ml-2" />
              </button>
            </div>
            <div className="space-y-4">
              {loading && !bookingPreview.length ? (
                <p className="text-slate-500 text-sm">Loading bookings...</p>
              ) : bookingPreview.length ? (
                bookingPreview.map((booking) => (
                  <div key={booking._id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-[12rem]">
                        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                          {badgeInitials(booking.tour?.country || booking.tour?.title || booking.destination)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{booking.tour?.title || booking.destination || "Custom journey"}</p>
                          <p className="text-xs text-slate-500">{formatRange(booking)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-right">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[booking.status?.toLowerCase()] || "text-slate-600 bg-slate-100 border-slate-200"}`}>
                          {booking.status || "Pending"}
                        </span>
                        <p className="text-sm font-semibold">{formatAmount(booking.totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No bookings yet. Explore tours and confirm your first journey.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white/90 border border-slate-100 p-6 space-y-6 shadow-[0_30px_100px_-80px_rgba(15,23,42,0.55)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Support</p>
                <h3 className="text-2xl font-semibold">Tickets</h3>
              </div>
              <button onClick={() => navigate("/support-center")} className="inline-flex items-center text-sm font-semibold text-slate-900">
                Open center
                <FaHeadset className="ml-2" />
              </button>
            </div>
            <div className="space-y-4">
              {supportPreview.length ? (
                supportPreview.map((ticket) => (
                  <div key={ticket._id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50/80">
                    <div className="flex justify-between text-sm">
                      <p className="font-semibold">#{ticket.ticketId || ticket._id?.slice(-6)}</p>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[ticket.status?.toLowerCase()] || "text-slate-600 bg-slate-100 border-slate-200"}`}>
                        {ticket.status || "Open"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{ticket.subject || "General support"}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{latestTicketMessage(ticket) || "Awaiting concierge reply"}</p>
                    <p className="text-xs text-slate-400 mt-1">Last updated {formatDate(ticket.updatedAt || ticket.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No support tickets right now.</p>
              )}
            </div>
          </div>
        </section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-2">
          {[{ title: "Cart", items: cartPreview, empty: "Cart is empty", icon: FaShoppingCart }, { title: "Favourites", items: favoritePreview, empty: "Save a tour to track it", icon: FaHeart }].map((panel) => (
            <motion.div
              key={panel.title}
              variants={cardVariants}
              className="rounded-[2.5rem] bg-white/90 border border-slate-100 p-6 shadow-[0_30px_100px_-80px_rgba(15,23,42,0.55)] backdrop-blur"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">{panel.title}</p>
                  <h3 className="text-2xl font-semibold">
                    {panel.title === "Cart" && cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""}` : panel.title === "Favourites" ? `${favorites.length} saved` : panel.title}
                  </h3>
                </div>
                <panel.icon className="text-2xl text-slate-400" />
              </div>
              {panel.items.length ? (
                panel.items.map((item) => (
                  <div key={item._id || item.tour?._id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-4 mb-3 last:mb-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title || item.tour?.title || "Untitled"}</p>
                      <p className="text-xs text-slate-500">{item.tour?.country || item.destination || item.category || "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatAmount(item.price || item.tour?.price || 0)}</p>
                      {panel.title === "Cart" && item.quantity && (
                        <p className="text-xs text-slate-500">{item.quantity} ticket{item.quantity > 1 ? "s" : ""}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">{panel.empty}</p>
              )}
            </motion.div>
          ))}
        </motion.section>

        <section className="rounded-[2.5rem] bg-white/90 border border-slate-100 p-6 shadow-[0_30px_100px_-80px_rgba(15,23,42,0.55)] backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Featured now</p>
              <h3 className="text-2xl font-semibold">Recommend new journeys</h3>
            </div>
            <button onClick={() => navigate("/explore-tours")} className="inline-flex items-center text-sm font-semibold text-slate-900">
              Browse tours
              <FaCompass className="ml-2" />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredTours.length ? (
              featuredTours.map((tour) => (
                <div key={tour._id || tour.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-sm font-semibold text-slate-900">{tour.title}</p>
                  <p className="text-xs text-slate-500">{tour.country || tour.location || "—"}</p>
                  <p className="text-base font-semibold mt-3">{formatAmount(tour.price)}</p>
                  <button onClick={() => navigate(`/tours/${tour._id || tour.id}`)} className="mt-3 inline-flex items-center text-xs font-semibold text-slate-900">
                    View tour
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No featured tours right now.</p>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2.5rem] bg-white/90 border border-slate-100 p-6 shadow-[0_30px_100px_-80px_rgba(15,23,42,0.55)] backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Recent tickets</p>
                <h3 className="text-2xl font-semibold">Support timeline</h3>
              </div>
              <FaTicketAlt className="text-xl text-slate-400" />
            </div>
            <div className="space-y-4">
              {tickets.length ? (
                tickets.slice(0, 4).map((ticket) => (
                  <div key={ticket._id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                      <span className="text-sm font-semibold">#{ticket.ticketId || ticket._id?.slice(-4)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{ticket.subject || "General"}</p>
                      <p className="text-xs text-slate-500">{ticket.status || "Open"} • Updated {formatDate(ticket.updatedAt || ticket.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No tickets to show.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white/90 border border-slate-100 p-6 shadow-[0_30px_100px_-80px_rgba(15,23,42,0.55)] backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-500">Next steps</p>
                <h3 className="text-2xl font-semibold">Quick actions</h3>
              </div>
              <FaArrowRight className="text-xl text-slate-400" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={action.action}
                  className={`rounded-2xl border border-neutral-200 bg-gradient-to-br ${action.accent} p-4 text-left text-white shadow-lg`}
                >
                  <action.icon className="text-2xl mb-3" />
                  <p className="text-sm font-semibold uppercase tracking-[0.3em]">{action.title}</p>
                  <p className="text-xs text-white/80">{action.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
