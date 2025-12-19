import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const statusColors = {
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  EXPIRED: "bg-gray-200 text-gray-600",
};

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ================= LOAD SUBSCRIPTIONS ================= */
  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/subscriptions");
      const list = res.data.subscriptions || [];
      setSubscriptions(list);
      setFiltered(list);
    } catch {
      Swal.fire("Error", "Failed to load subscriptions", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  /* ================= FILTER + SEARCH ================= */
  useEffect(() => {
    let data = [...subscriptions];

    // Search
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        (sub) =>
          sub.user?.fullName?.toLowerCase().includes(s) ||
          sub.user?.email?.toLowerCase().includes(s) ||
          sub.product?.productName?.toLowerCase().includes(s) ||
          sub.variantSku?.toLowerCase().includes(s)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      data = data.filter((sub) => sub.status === statusFilter);
    }

    // Date filters
    if (startDate) {
      const sd = new Date(startDate);
      sd.setHours(0, 0, 0, 0);
      data = data.filter((sub) => new Date(sub.startDate) >= sd);
    }

    if (endDate) {
      const ed = new Date(endDate);
      ed.setHours(23, 59, 59, 999);
      data = data.filter((sub) => new Date(sub.endDate) <= ed);
    }

    setFiltered(data);
  }, [search, statusFilter, startDate, endDate, subscriptions]);

  /* ================= EXPORT EXCEL ================= */
  const exportExcel = () => {
    const rows = filtered.map((s) => ({
      "User Name": s.user?.fullName,
      Email: s.user?.email,
      Product: s.product?.productName,
      Variant: s.variantSku,
      "Qty / Day": s.quantityPerDay,
      Frequency: s.frequency,
      "Start Date": new Date(s.startDate).toLocaleDateString(),
      "End Date": new Date(s.endDate).toLocaleDateString(),
      Status: s.status,
      Amount: s.totalAmount,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subscriptions");
    XLSX.writeFile(wb, "subscriptions.xlsx");
  };

  /* ================= EXPORT PDF ================= */
  const exportPDF = () => {
    const doc = new jsPDF("landscape");
    doc.text("SUBSCRIPTION REPORT", 14, 10);

    autoTable(doc, {
      startY: 18,
      head: [
        [
          "User",
          "Email",
          "Product",
          "SKU",
          "Qty",
          "Freq",
          "Start",
          "End",
          "Status",
          "Amount",
        ],
      ],
      body: filtered.map((s) => [
        s.user?.fullName,
        s.user?.email,
        s.product?.productName,
        s.variantSku,
        s.quantityPerDay,
        s.frequency,
        new Date(s.startDate).toLocaleDateString(),
        new Date(s.endDate).toLocaleDateString(),
        s.status,
        "₹" + s.totalAmount,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 122, 0] },
    });

    doc.save("subscriptions.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Subscription Management
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-5 items-end">
        <input
          type="text"
          placeholder="Search user, product, SKU..."
          className="border px-3 py-2 rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PAUSED">PAUSED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="EXPIRED">EXPIRED</option>
        </select>

        <input
          type="date"
          className="border px-3 py-2 rounded-lg"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded-lg"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Export Excel
        </button>

        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Export PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="text-center py-8">Loading subscriptions...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No subscriptions found
          </p>
        ) : (
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="p-3">User</th>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Frequency</th>
                <th className="p-3">Period</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    <p className="font-medium">{s.user?.fullName}</p>
                    <p className="text-xs text-gray-500">
                      {s.user?.email}
                    </p>
                  </td>

                  <td className="p-3">{s.product?.productName}</td>
                  <td className="p-3">{s.variantSku}</td>
                  <td className="p-3">{s.quantityPerDay}</td>
                  <td className="p-3">{s.frequency}</td>

                  <td className="p-3 text-xs">
                    <div>{new Date(s.startDate).toLocaleDateString()}</div>
                    <div className="text-gray-400">to</div>
                    <div>{new Date(s.endDate).toLocaleDateString()}</div>
                  </td>

                  <td className="p-3 font-semibold">
                    ₹{s.totalAmount}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;
