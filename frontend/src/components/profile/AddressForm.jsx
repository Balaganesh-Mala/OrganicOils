import { useState } from "react";
import Swal from "sweetalert2";
import { addAddress, updateAddress } from "../../api/index.api";

export default function AddressForm({
  onClose,
  onSuccess,
  editingAddress = null,
}) {
  const [form, setForm] = useState({
    fullName: editingAddress?.fullName || "",
    phone: editingAddress?.phone || "",
    street: editingAddress?.street || "",
    city: editingAddress?.city || "",
    state: editingAddress?.state || "",
    pincode: editingAddress?.pincode || "",
  });

  /* ================= PHONE CHANGE ================= */
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // numbers only
    if (value.length <= 10) {
      setForm({ ...form, phone: value });
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    // 🔴 PHONE VALIDATION
    if (form.phone.length !== 10) {
      Swal.fire(
        "Invalid Phone Number",
        "Phone number must be exactly 10 digits",
        "warning"
      );
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, form);
        Swal.fire("Updated", "Address updated successfully", "success");
      } else {
        await addAddress(form);
        Swal.fire("Added", "Address added successfully", "success");
      }

      onSuccess(); // refresh profile
      onClose(); // close modal
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Address action failed",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">
          {editingAddress ? "Edit Address" : "Add Address"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* FULL NAME */}
          <input
            placeholder="FULL NAME"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input"
          />

          {/* PHONE */}
          <input
            placeholder="PHONE NUMBER"
            value={form.phone}
            onChange={handlePhoneChange}
            inputMode="numeric"
            maxLength={10}
            className="input"
          />

          {/* CITY */}
          <input
            placeholder="CITY"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="input"
          />

          {/* STATE */}
          <input
            placeholder="STATE"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="input"
          />

          {/* PINCODE */}
          <input
            placeholder="PINCODE"
            value={form.pincode}
            onChange={(e) =>
              setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })
            }
            className="input"
          />

          {/* STREET */}
          <input
            placeholder="STREET ADDRESS"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="input sm:col-span-2"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700
               hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-[#8fbc8f] text-white
               hover:bg-[#7aa97a] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
