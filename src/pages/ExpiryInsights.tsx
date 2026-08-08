import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Voucher {
  id: string;
  brand_name: string;
  expiry_date: string;
  original_value: number;
}

export default function ExpiryInsights() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Expiry Insights
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🔥 Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300">
              <p className="text-sm text-gray-500">Total Vouchers</p>
              <p className="text-xl font-bold">{vouchers.length}</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300">
              <p className="text-sm text-gray-500">Expiring This Month</p>
              <p className="text-xl font-bold">
                {expiringThisMonth}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300">
              <p className="text-sm text-gray-500">Total Expiry Value</p>
              <p className="text-xl font-bold">
                ₹{totalExpiryValue}
              </p>
            </div>
          </div>

          {/* 🔥 Calendar */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <Calendar
              onClickDay={(date) => setSelectedDate(date)}
              tileClassName={({ date }) => {
                const count = getExpiryCount(date);

                if (count >= 5)
                  return "bg-red-600 text-white rounded-lg";
                if (count >= 3)
                  return "bg-orange-500 text-white rounded-lg";
                if (count >= 1)
                  return "bg-yellow-300 rounded-lg";

                return null;
              }}
            />

            {/* 🔥 Selected Date Section */}
            {selectedDate && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">
                  Vouchers expiring on{" "}
                  {selectedDate.toDateString()}
                </h2>

                {vouchersForSelectedDate.length > 0 ? (
                  vouchersForSelectedDate.map((v) => (
                    <div
                      key={v.id}
                      className="bg-gray-50 border p-4 rounded-lg shadow-sm mb-3"
                    >
                      <p className="font-semibold">
                        {v.brand_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Value: ₹{v.original_value}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No vouchers expiring on this day.
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
