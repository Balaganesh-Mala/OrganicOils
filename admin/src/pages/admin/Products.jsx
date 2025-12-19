import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaDownload,
  FaCloudUploadAlt,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [images, setImages] = useState([]); // preview + files
  const [existingImages, setExistingImages] = useState([]); // DB images

  const [form, setForm] = useState({
    productName: "",
    category: "",
    description: "",
    isFeatured: false,
    isBestSeller: false,
  });

  const [variants, setVariants] = useState([
    { weight: "", price: "", mrp: "", stock: "", sku: "" },
  ]);

  const [page, setPage] = useState(1);
  const perPage = 50;

  /* ================= LOAD ================= */
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await adminApi.get("/products");
    const data = [...res.data.products].reverse();
    setProducts(data);
    setFiltered(data);
  };

  const loadCategories = async () => {
    const res = await adminApi.get("/categories");
    setCategories(res.data.categories);
  };

  /* ================= FILTER ================= */
  useEffect(() => {
    let data = [...products];

    if (search) {
      data = data.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      data = data.filter((p) => p.category?._id === categoryFilter);
    }

    setFiltered(data);
    setPage(1);
  }, [search, categoryFilter, products]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedData = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleVariantChange = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  const addVariant = () =>
    setVariants([...variants, { weight: "", price: "", mrp: "", stock: "", sku: "" }]);

  const removeVariant = (i) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  /* ================= IMAGES ================= */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      Swal.fire("Limit Reached", "Max 6 images allowed", "warning");
      return;
    }
    files.forEach((file) =>
      setImages((prev) => [...prev, { file, preview: URL.createObjectURL(file) }])
    );
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= MODAL ================= */
  const openCreateModal = () => {
    setEditMode(false);
    setSelectedProduct(null);
    setImages([]);
    setExistingImages([]);
    setVariants([{ weight: "", price: "", mrp: "", stock: "", sku: "" }]);
    setForm({
      productName: "",
      category: "",
      description: "",
      isFeatured: false,
      isBestSeller: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditMode(true);
    setSelectedProduct(p);
    setExistingImages(p.images || []);
    setImages(
      p.images?.map((i) => ({ preview: i.url, file: null })) || []
    );
    setVariants(p.variants);
    setForm({
      productName: p.productName,
      category: p.category?._id,
      description: p.description,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
    });
    setModalOpen(true);
  };

  /* ================= SUBMIT ================= */
  const submitForm = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("variants", JSON.stringify(variants));

      if (editMode) {
        fd.append("existingImages", JSON.stringify(existingImages));
      }

      images.forEach((img) => img.file && fd.append("images", img.file));

      editMode
        ? await adminApi.put(`/products/${selectedProduct._id}`, fd)
        : await adminApi.post("/products", fd);

      Swal.fire("Success", editMode ? "Updated" : "Created", "success");
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    Swal.fire({ title: "Delete?", icon: "warning", showCancelButton: true }).then(
      async (r) => {
        if (r.isConfirmed) {
          await adminApi.delete(`/products/${id}`);
          loadProducts();
        }
      }
    );
  };

  /* ================= EXPORT ================= */
  const exportExcel = () => {
    const formatted = filtered.map((p) => ({
      Name: p.productName,
      Price: p.variants?.[0]?.price,
      Stock: p.variants.reduce((s, v) => s + v.stock, 0),
      Category: p.category?.title,
    }));
    const sheet = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Name", "Price", "Stock", "Category"]],
      body: filtered.map((p) => [
        p.productName,
        p.variants?.[0]?.price,
        p.variants.reduce((s, v) => s + v.stock, 0),
        p.category?.title,
      ]),
    });
    doc.save("products.pdf");
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <button onClick={openCreateModal} className="bg-orange-600 text-white px-4 py-2 rounded-lg">
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input className="border p-2" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
        <select className="border p-2" onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
        <button onClick={exportExcel}><FaDownload /> Excel</button>
        <button onClick={exportPDF}><FaDownload /> PDF</button>
      </div>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Bestseller</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((p) => (
              <tr key={p._id}>
                <td><img src={p.images?.[0]?.url} className="w-12 h-12" /></td>
                <td>{p.productName}</td>
                <td>₹{p.variants?.[0]?.price}</td>
                <td>{p.variants.reduce((s, v) => s + v.stock, 0)}</td>
                <td>{p.category?.title}</td>
                <td>{p.isFeatured ? "Yes" : "No"}</td>
                <td>{p.isBestSeller ? "Yes" : "No"}</td>
                <td className="flex gap-2">
                  <FaEdit onClick={() => openEditModal(p)} />
                  <FaTrash onClick={() => deleteProduct(p._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
            <form onSubmit={submitForm} className="space-y-3">
              <input name="productName" value={form.productName} onChange={handleChange} className="border p-2 w-full" placeholder="Product Name" />

              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-6 gap-2">
                  {["weight", "price", "mrp", "stock", "sku"].map((f) => (
                    <input key={f} value={v[f]} onChange={(e) => handleVariantChange(i, f, e.target.value)} className="border p-1" placeholder={f} />
                  ))}
                  <button type="button" onClick={() => removeVariant(i)}>X</button>
                </div>
              ))}

              <button type="button" onClick={addVariant}>+ Add Variant</button>

              <select name="category" value={form.category} onChange={handleChange} className="border p-2 w-full">
                <option>Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>

              <textarea name="description" value={form.description} onChange={handleChange} className="border p-2 w-full" placeholder="Description" />

              {/* IMAGE UPLOAD */}
              <label className="font-semibold">Images (Max 6)</label>
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img.preview} className="h-24 w-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black text-white px-1">X</button>
                  </div>
                ))}
                {images.length < 6 && (
                  <label className="border-dashed border flex items-center justify-center h-24 cursor-pointer">
                    <FaCloudUploadAlt />
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">
                {loadingSubmit ? "Saving..." : editMode ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
