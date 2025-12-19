import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getAllCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../api/category.api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 50;

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);

  /* ================= LOAD ================= */
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategoriesApi();
      const list = res.data.categories || [];
      const sorted = [...list].reverse(); // newest first
      setCategories(sorted);
      setFiltered(sorted);
    } catch {
      Swal.fire("Error", "Failed to load categories", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= FILTER ================= */
  useEffect(() => {
    let data = [...categories];

    if (search.trim()) {
      data = data.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (startDate) {
      const sd = new Date(startDate);
      sd.setHours(0, 0, 0, 0);
      data = data.filter((c) => new Date(c.createdAt) >= sd);
    }

    if (endDate) {
      const ed = new Date(endDate);
      ed.setHours(23, 59, 59, 999);
      data = data.filter((c) => new Date(c.createdAt) <= ed);
    }

    setFiltered(data);
    setPage(1);
  }, [search, startDate, endDate, categories]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  /* ================= MODALS ================= */
  const openCreateModal = () => {
    setEditId(null);
    setForm({ title: "", description: "", image: null });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditId(cat._id);
    setForm({
      title: cat.title,
      description: cat.description || "",
      image: null,
    });
    setShowModal(true);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.title.trim()) {
      Swal.fire("Warning", "Title is required", "warning");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    try {
      editId
        ? await updateCategoryApi(editId, fd)
        : await createCategoryApi(fd);

      Swal.fire("Success", editId ? "Updated" : "Created", "success");
      loadCategories();
      setShowModal(false);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (!res.isConfirmed) return;
      try {
        await deleteCategoryApi(id);
        Swal.fire("Deleted", "Category removed", "success");
        loadCategories();
      } catch {
        Swal.fire("Error", "Delete failed", "error");
      }
    });
  };

  /* ================= EXPORT EXCEL ================= */
  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(
      filtered.map((c) => ({
        "Created On": new Date(c.createdAt).toLocaleString(),
        Title: c.title,
        Description: c.description,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Categories");
    XLSX.writeFile(wb, `categories_${new Date().toLocaleDateString()}.xlsx`);
  };

  /* ================= EXPORT PDF ================= */
  const exportPDF = () => {
    const doc = new jsPDF("landscape");
    doc.text("CATEGORY REPORT", 14, 10);

    const rows = filtered.map((c) => [
      new Date(c.createdAt).toLocaleString(),
      c.title,
      c.description,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["Created", "Title", "Description"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 8 },
    });

    doc.save("categories.pdf");
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <input
          type="text"
          placeholder="Search category..."
          className="border p-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-3 py-2 rounded-lg"
        >
          Export Excel
        </button>

        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-3 py-2 rounded-lg"
        >
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 shadow rounded-xl overflow-x-auto">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : paginated.length === 0 ? (
          <p className="text-center py-6">No categories found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">Image</th>
                <th className="py-3">Title</th>
                <th className="py-3">Description</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">
                    <img
                      src={cat.image?.url}
                      className="w-12 h-12 rounded object-cover"
                      alt=""
                    />
                  </td>
                  <td className="py-3 font-medium">{cat.title}</td>
                  <td className="py-3 text-sm">{cat.description}</td>
                  <td className="py-2 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 border rounded-lg flex items-center gap-1 text-sm"
          >
            <MdNavigateBefore size={18} /> Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium border ${
                  p === page
                    ? "bg-orange-600 text-white border-orange-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-2 border rounded-lg flex items-center gap-1 text-sm"
          >
            Next <MdNavigateNext size={18} />
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Category" : "Add Category"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Category Title"
                className="border p-2 rounded w-full"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files[0] })
                }
                className="border p-2 rounded w-full"
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-orange-600 text-white py-2 rounded"
              >
                {editId ? "Update Category" : "Create Category"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
