import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Loader, Calendar as CalendarIcon, Info, TrendingUp, AlertTriangle } from "lucide-react";

interface Voucher {
  id: string;
  brand_name: string;
  expiry_date: string;
  original_value: number;
}

export default function ExpiryInsights() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    const { data, error } = await supabase
      .from("vouchers")
      .select("id, brand_name, expiry_date, original_value")
      .eq("is_verified", true);

    if (!error && data) {
      setVouchers(data);
    }

    setLoading(false);
  };

  const getExpiryCount = (date: Date) => {
    return vouchers.filter(
      (v) =>
        new Date(v.expiry_date).toDateString() ===
        date.toDateString()
    ).length;
  };

  const vouchersForSelectedDate = selectedDate
    ? vouchers.filter(
      (v) =>
        new Date(v.expiry_date).toDateString() ===
        selectedDate.toDateString()
    )
    : [];

  const totalExpiryValue = vouchers.reduce(
    (sum, v) => sum + Number(v.original_value),
    0
  );

  const expiringThisMonth = vouchers.filter((v) => {
    const now = new Date();
    const expiry = new Date(v.expiry_date);
    return (
      expiry.getMonth() === now.getMonth() &&
      expiry.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-brand rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <CalendarIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Expiry Insights</h1>
            <p className="text-white/90 text-lg">Predictive analytics for your voucher portfolio</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-10 w-10 text-brand-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* 🔥 Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-muted-text uppercase tracking-widest">Total Vouchers</p>
                <Info className="h-4 w-4 text-brand-primary" />
              </div>
              <p className="text-3xl font-bold text-main-text">{vouchers.length}</p>
            </div>

            <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-muted-text uppercase tracking-widest">Expiring This Month</p>
                <AlertTriangle className="h-4 w-4 text-status-warning" />
              </div>
              <p className="text-3xl font-bold text-status-error">
                {expiringThisMonth}
              </p>
            </div>

            <div className="bg-card backdrop-blur-sm rounded-xl p-6 border border-main-border shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-muted-text uppercase tracking-widest">At-Risk Value</p>
                <TrendingUp className="h-4 w-4 text-status-success" />
              </div>
              <p className="text-3xl font-bold text-main-text">
                ${totalExpiryValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* 🔥 Calendar */}
            <div className="bg-card backdrop-blur-sm rounded-2xl p-6 border border-main-border shadow-soft">
              <h2 className="text-xl font-bold text-main-text mb-6">Expiry Calendar</h2>
              <div className="theme-calendar-wrapper">
                <Calendar
                  onClickDay={(date) => setSelectedDate(date)}
                  value={selectedDate}
                  tileClassName={({ date }) => {
                    const count = getExpiryCount(date);
                    if (count >= 5) return "tile-critical";
                    if (count >= 3) return "tile-warning";
                    if (count >= 1) return "tile-info";
                    return null;
                  }}
                />
              </div>
            </div>

            {/* 🔥 Selected Date Section */}
            <div className="bg-card backdrop-blur-sm rounded-2xl p-6 border border-main-border shadow-soft">
              <h2 className="text-xl font-bold text-main-text mb-6 flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-brand-primary" />
                <span>Vouchers Expiring on {selectedDate?.toLocaleDateString()}</span>
              </h2>

              {vouchersForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {vouchersForSelectedDate.map((v) => (
                    <div
                      key={v.id}
                      className="bg-muted-bg/50 border border-main-border p-4 rounded-xl shadow-sm hover:bg-card-hover transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-main-text text-lg">
                            {v.brand_name}
                          </p>
                          <p className="text-sm text-dim font-medium">
                            Value: <span className="text-main-text font-bold">${v.original_value}</span>
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                          <Info className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-muted-bg rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-dim" />
                  </div>
                  <p className="text-muted-text font-bold">
                    Clean slate! No vouchers expiring on this day.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
