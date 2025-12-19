import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import Swal from "sweetalert2";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const [form, setForm] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    address: "",
    logo: null,
  });

  /* ================= LOAD SETTINGS ================= */
  const loadSettings = async () => {
    try {
      const res = await adminApi.get("/settings");
      setForm(res.data.settings);
    } catch (err) {
      Swal.fire("Error", "Failed to load settings", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= LOGO UPLOAD ================= */
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("logo", file);

    setLogoUploading(true);
    try {
      const res = await adminApi.put("/settings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm(res.data.settings);
      Swal.fire("Updated", "Logo uploaded successfully", "success");
    } catch {
      Swal.fire("Error", "Logo upload failed", "error");
    }
    setLogoUploading(false);
  };

  /* ================= SAVE SETTINGS ================= */
  const saveSettings = async () => {
    setSaving(true);
    try {
      await adminApi.put("/settings", {
        storeName: form.storeName,
        supportEmail: form.supportEmail,
        supportPhone: form.supportPhone,
        address: form.address,
      });

      Swal.fire("Saved", "Settings updated successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to save settings", "error");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading settings…</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Store Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= BRANDING ================= */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-6">Branding</h2>

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36">
              {form.logo?.url ? (
                <img
                  src={form.logo.url}
                  alt="Logo"
                  className="w-36 h-36 object-cover rounded-xl border shadow"
                />
              ) : (
                <div className="w-36 h-36 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  No Logo
                </div>
              )}

              {/* 🔄 Upload Loader */}
              {logoUploading && (
                <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
                </div>
              )}
            </div>

            <label
              className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${
                logoUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {logoUploading ? "Uploading…" : "Change Logo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={logoUploading}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-400 text-center">
              Recommended: 500×500 • JPG / PNG / WebP
            </p>
          </div>
        </div>

        {/* ================= STORE DETAILS ================= */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-6">Store Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={form.supportEmail}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Support Phone</label>
              <input
                type="text"
                name="supportPhone"
                value={form.supportPhone}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
                className="w-full mt-1 p-3 border rounded-lg resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`px-6 py-3 rounded-xl text-white font-medium ${
                saving
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
