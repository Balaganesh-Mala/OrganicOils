import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCloudUploadAlt,
  FaCheck,
} from "react-icons/fa";

/* ================= STEPS ================= */
const STEPS = ["Product Details", "Images", "Variants & Stock", "Visibility"];

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
    <span className="font-medium text-gray-700">{label}</span>
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-11 h-6 rounded-full transition ${
          checked ? "bg-orange-600" : "bg-gray-300"
        }`}
      />
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </div>
  </label>
);

const TableToggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition
      ${checked ? "bg-green-600" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition
        ${checked ? "translate-x-4" : "translate-x-1"}`}
    />
  </button>
);

const Products = () => {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("ALL");

  const [featuredFilter, setFeaturedFilter] = useState("ALL");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [variants, setVariants] = useState([
    { weight: "", price: "", mrp: "", stock: "", sku: "" },
  ]);

  const [form, setForm] = useState({
    productName: "",
    shortDescription: "",
    description: "",
    brand: "Hunger Bites",
    category: "",
    ingredients: "",
    shelfLife: "",
    storageInstructions: "",
    madeIn: "",
    isOrganic: false,
    coldPressed: false,
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    isSubscribable: false,
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await adminApi.get("/products");
    setProducts(res.data.products || []);
  };

  const loadCategories = async () => {
    const res = await adminApi.get("/categories");
    setCategories(res.data.categories || []);
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  /* ================= VARIANTS ================= */
  const handleVariantChange = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      { weight: "", price: "", mrp: "", stock: "", sku: "" },
    ]);

  const removeVariant = (i) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  /* ================= IMAGES ================= */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + existingImages.length > 6) {
      Swal.fire("Maximum 6 images allowed");
      return;
    }

    files.forEach((file) =>
      setImages((p) => [...p, { file, preview: URL.createObjectURL(file) }])
    );
  };

  const removeImage = (i, existing) => {
    existing
      ? setExistingImages(existingImages.filter((_, idx) => idx !== i))
      : setImages(images.filter((_, idx) => idx !== i));
  };

  /* ================= MODAL ================= */
  const resetForm = () => {
    setStep(0);
    setImages([]);
    setExistingImages([]);
    setVariants([{ weight: "", price: "", mrp: "", stock: "", sku: "" }]);
    setForm({
      productName: "",
      shortDescription: "",
      description: "",
      brand: "Pristine Organic Oils",
      category: "",
      ingredients: "",
      shelfLife: "",
      storageInstructions: "",
      madeIn: "",
      isOrganic: false,
      coldPressed: false,
      isFeatured: false,
      isBestSeller: false,
      isActive: true,
      isSubscribable: false,
    });
  };

  const openCreateModal = () => {
    setEditMode(false);
    setSelectedProduct(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditMode(true);
    setSelectedProduct(p);
    setExistingImages(p.images || []);
    setImages([]);
    setVariants(p.variants || []);

    setForm({
      productName: p.productName,
      shortDescription: p.shortDescription || "",
      description: p.description,
      brand: p.brand || "",
      category: p.category?._id || "",
      ingredients: p.ingredients?.join(", ") || "",
      shelfLife: p.shelfLife || "",
      expiryDate: p.expiryDate?.split("T")[0] || "",
      storageInstructions: p.storageInstructions || "",
      madeIn: p.madeIn || "",
      isOrganic: p.isOrganic,
      coldPressed: p.coldPressed,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isActive: p.isActive,
      isSubscribable: p.isSubscribable,
    });

    setStep(0);
    setModalOpen(true);
  };

  /* ================= SUBMIT ================= */
  const submitForm = async () => {
    try {
      setLoading(true);
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (k === "ingredients") {
          fd.append(
            "ingredients",
            JSON.stringify(
              v
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean)
            )
          );
        } else {
          fd.append(k, v);
        }
      });

      fd.append("variants", JSON.stringify(variants));
      if (editMode) fd.append("existingImages", JSON.stringify(existingImages));
      images.forEach((img) => fd.append("images", img.file));

      editMode
        ? await adminApi.put(`/products/${selectedProduct._id}`, fd)
        : await adminApi.post("/products", fd);

      Swal.fire("Success", editMode ? "Updated" : "Created", "success");
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      Swal.fire(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    Swal.fire({ title: "Delete product?", showCancelButton: true }).then(
      async (r) => {
        if (r.isConfirmed) {
          await adminApi.delete(`/products/${id}`);
          loadProducts();
        }
      }
    );
  };

  const LOW_STOCK_LIMIT = 10;

  const getTotalStock = (product) =>
    product.variants?.reduce((sum, v) => sum + Number(v.stock || 0), 0) || 0;

  const hasOutOfStockVariant = (product) =>
    product.variants?.some((v) => Number(v.stock) === 0);

  const allVariantsOutOfStock = (product) =>
    product.variants?.every((v) => Number(v.stock) === 0);

  const getPriceRange = (product) => {
    if (!product.variants?.length) return "-";

    const prices = product.variants.map((v) => Number(v.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return min === max ? `₹${min}` : `₹${min} – ₹${max}`;
  };

  const hasLimitedStockVariant = (product) =>
    product.variants?.some((v) => v.stock > 0 && v.stock <= LOW_STOCK_LIMIT);

  const allVariantsHealthyStock = (product) =>
    product.variants?.every((v) => v.stock > LOW_STOCK_LIMIT);

  const isInStock = (product) =>
    !allVariantsOutOfStock(product) && !hasLimitedStockVariant(product);

  const isLimitedStock = (product) =>
    hasLimitedStockVariant(product) && !allVariantsOutOfStock(product);

  const isOutOfStock = (product) => allVariantsOutOfStock(product);

  const filteredProducts = products.filter((p) => {
    // 🔍 SEARCH
    if (search && !p.productName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // 📦 STOCK FILTER
    if (stockFilter === "IN_STOCK" && !isInStock(p)) return false;
    if (stockFilter === "LIMITED" && !isLimitedStock(p)) return false;
    if (stockFilter === "OUT_OF_STOCK" && !isOutOfStock(p)) return false;

    // ⭐ FEATURED FILTER
    if (featuredFilter === "FEATURED" && !p.isFeatured) return false;
    if (featuredFilter === "NOT_FEATURED" && p.isFeatured) return false;

    return true;
  });

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4 items-center">
        {/* SEARCH */}
        <input
          className="input w-64"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* STOCK FILTER */}
        <select
          className="input w-48"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="ALL">All Stock</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LIMITED">Limited Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>

        {/* FEATURED FILTER */}
        <select
          className="input w-48"
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
        >
          <option value="ALL">All Products</option>
          <option value="FEATURED">Featured</option>
          <option value="NOT_FEATURED">Not Featured</option>
        </select>

        {/* RESET */}
        <button
          onClick={() => {
            setSearch("");
            setStockFilter("ALL");
            setFeaturedFilter("ALL");
          }}
          className="text-sm text-gray-500 hover:underline ml-auto"
        >
          Reset filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Best Seller</th>
              <th>Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50 transition">
                {/* PRODUCT */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="font-medium">{p.productName}</span>
                </td>

                {/* CATEGORY */}
                <td>{p.category?.title || "-"}</td>

                {/* PRICE */}
                <td className="font-medium text-gray-800">
                  {getPriceRange(p)}
                </td>

                {/* STOCK */}
                <td className="relative group text-center">
                  {/* STOCK BADGE */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
      ${
        allVariantsOutOfStock(p)
          ? "bg-red-100 text-red-700"
          : hasLimitedStockVariant(p)
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
                  >
                    {getTotalStock(p)} units
                  </span>

                  {/* LIMITED STOCK WARNING */}
                  {hasLimitedStockVariant(p) && !allVariantsOutOfStock(p) && (
                    <span
                      className="ml-1 text-yellow-600 text-xs font-semibold"
                      title="Limited stock available"
                    >
                      ⚠
                    </span>
                  )}

                  {/* FULL OUT-OF-STOCK LABEL */}
                  {allVariantsOutOfStock(p) && (
                    <span className="ml-1 text-red-600 text-xs font-semibold"></span>
                  )}

                  {/* VARIANT BREAKDOWN TOOLTIP */}
                  <div
                    className="
      absolute z-20 hidden group-hover:block
      top-1/2 left-full ml-3 -translate-y-1/2
      bg-white border shadow-lg rounded-lg
      p-3 text-xs text-left min-w-[180px]
    "
                  >
                    <p className="font-semibold mb-1">Variant Stock</p>

                    {p.variants.map((v, i) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center
          ${
            v.stock === 0
              ? "text-red-600"
              : v.stock <= LOW_STOCK_LIMIT
              ? "text-yellow-600"
              : "text-gray-700"
          }`}
                      >
                        <span>{v.weight}</span>

                        <span className="flex items-center gap-1">
                          {v.stock}
                          {v.stock === 0 && (
                            <span title="Out of stock">❌</span>
                          )}
                          {v.stock > 0 && v.stock <= LOW_STOCK_LIMIT && (
                            <span title="Limited stock">⚠</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* FEATURED */}
                <td>
                  <TableToggle
                    checked={p.isFeatured}
                    onChange={() =>
                      adminApi
                        .put(`/products/${p._id}`, {
                          isFeatured: !p.isFeatured,
                        })
                        .then(loadProducts)
                    }
                  />
                </td>

                {/* BEST SELLER */}
                <td>
                  <TableToggle
                    checked={p.isBestSeller}
                    onChange={() =>
                      adminApi
                        .put(`/products/${p._id}`, {
                          isBestSeller: !p.isBestSeller,
                        })
                        .then(loadProducts)
                    }
                  />
                </td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-2 py-1 text-xs rounded
                ${
                  p.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-3">
                    <FaEdit
                      className="cursor-pointer text-blue-600 hover:scale-110"
                      onClick={() => openEditModal(p)}
                    />
                    <FaTrash
                      className="cursor-pointer text-red-600 hover:scale-110"
                      onClick={() => deleteProduct(p._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-xl max-h-[95vh] overflow-y-auto">
            {/* HEADER */}
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editMode ? "Edit Product" : "Create Product"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* STEPPER */}
            <div className="px-6 py-5 grid grid-cols-4 gap-4">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold
              ${
                i <= step
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
                  >
                    {i < step ? <FaCheck /> : i + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      i === step ? "font-semibold" : "text-gray-500"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {/* BODY */}
            <div className="px-6 py-6 space-y-6">
              {/* STEP 1 – PRODUCT DETAILS */}
              {step === 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-4">
                    Product Details
                  </h3>

                  {/* REQUIRED FIELDS CARD */}
                  <div className="bg-white border rounded-xl p-4 space-y-4">
                    <h4 className="font-medium text-gray-700">
                      Basic Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        className="input"
                        placeholder="Product Name"
                        name="productName"
                        value={form.productName}
                        required
                        onChange={handleChange}
                      />

                      <select
                        className="input"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title}
                          </option>
                        ))}
                      </select>

                      <textarea
                        className="input col-span-2"
                        placeholder="Short Description (Optional)"
                        name="shortDescription"
                        value={form.shortDescription}
                        onChange={handleChange}
                      />

                      <textarea
                        className="input col-span-2"
                        placeholder="Full Description"
                        name="description"
                        required
                        value={form.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* OPTIONAL ACCORDION */}
                  <details className="group bg-white border rounded-xl mt-5">
                    <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium text-gray-700">
                      <span>Additional Information</span>
                      <span className="text-sm text-gray-400 group-open:hidden">
                        Click to expand
                      </span>
                      <span className="text-sm text-gray-400 hidden group-open:block">
                        Click to collapse
                      </span>
                    </summary>

                    <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-4">
                      <input
                        className="input col-span-2"
                        placeholder="Ingredients (comma separated)"
                        name="ingredients"
                        value={form.ingredients}
                        onChange={handleChange}
                      />

                      <input
                        className="input"
                        placeholder="Shelf Life (e.g. 6 months)"
                        name="shelfLife"
                        value={form.shelfLife}
                        onChange={handleChange}
                      />

                      <input
                        type="date"
                        className="input"
                        name="expiryDate"
                        value={form.expiryDate || ""}
                        onChange={handleChange}
                      />

                      <input
                        className="input"
                        placeholder="Made In"
                        name="madeIn"
                        value={form.madeIn}
                        onChange={handleChange}
                      />

                      <textarea
                        className="input col-span-2"
                        placeholder="Storage Instructions"
                        name="storageInstructions"
                        value={form.storageInstructions}
                        onChange={handleChange}
                      />
                    </div>
                  </details>
                </>
              )}

              {/* STEP 2 – IMAGES */}
              {step === 1 && (
                <>
                  <h3 className="text-lg font-semibold">
                    Product Images (Max 6)
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      ...existingImages.map((i) => ({ ...i, existing: true })),
                      ...images.map((i) => ({ ...i, existing: false })),
                    ].map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img.url || img.preview}
                          className="h-36 w-full rounded-xl object-cover"
                        />
                        <button
                          onClick={() => removeImage(i, img.existing)}
                          className="absolute top-2 right-2 bg-black/70 text-white px-2 rounded opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {existingImages.length + images.length < 6 && (
                      <label className="border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                        <FaCloudUploadAlt size={28} />
                        <span className="text-sm mt-2 text-gray-600">
                          Upload Images
                        </span>
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </>
              )}

              {/* STEP 3 – VARIANTS */}
              {step === 2 && (
                <>
                  <h3 className="text-lg font-semibold">Variants & Stock</h3>
                  <div className="space-y-4">
                    {variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-6 gap-2">
                        {["weight", "price", "mrp", "stock", "sku"].map((f) => (
                          <input
                            key={f}
                            className="input"
                            placeholder={f.toUpperCase()}
                            required
                            value={v[f]}
                            onChange={(e) =>
                              handleVariantChange(i, f, e.target.value)
                            }
                          />
                        ))}
                        <button
                          onClick={() => removeVariant(i)}
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addVariant}
                      className="text-orange-600 font-medium"
                    >
                      + Add Variant
                    </button>
                  </div>
                </>
              )}
              {/* STEP 4 – VISIBILITY (TOGGLES) */}
              {step === 3 && (
                <>
                  <h3 className="text-lg font-semibold">
                    Visibility & Attributes
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <Toggle
                      label="Best Seller"
                      checked={form.isBestSeller}
                      onChange={() =>
                        setForm({ ...form, isBestSeller: !form.isBestSeller })
                      }
                    />

                    <Toggle
                      label="Featured Product"
                      checked={form.isFeatured}
                      onChange={() =>
                        setForm({ ...form, isFeatured: !form.isFeatured })
                      }
                    />

                    <Toggle
                      label="Active Product"
                      checked={form.isActive}
                      onChange={() =>
                        setForm({ ...form, isActive: !form.isActive })
                      }
                    />

                    <Toggle
                      label="Allow Subscription"
                      checked={form.isSubscribable}
                      onChange={() =>
                        setForm({
                          ...form,
                          isSubscribable: !form.isSubscribable,
                        })
                      }
                    />

                    {/* NEW */}
                    <Toggle
                      label="Organic Product"
                      checked={form.isOrganic}
                      onChange={() =>
                        setForm({ ...form, isOrganic: !form.isOrganic })
                      }
                    />

                    <Toggle
                      label="Cold Pressed"
                      checked={form.coldPressed}
                      onChange={() =>
                        setForm({ ...form, coldPressed: !form.coldPressed })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="border-t px-6 py-4 flex justify-between">
              <button
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border rounded-lg"
              >
                Back
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitForm}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  {loading
                    ? "Saving..."
                    : editMode
                    ? "Update Product"
                    : "Create Product"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
