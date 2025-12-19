import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiChevronDown,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Helmet } from "react-helmet";
import {
  getPublicSettings,
  submitContactMessageApi,
} from "../api/index.api";

const ContactUs = () => {
  /* ================= STATE ================= */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    address: "",
  });

  const [activeFaq, setActiveFaq] = useState(null);

  /* ================= FAQ DATA ================= */
  const faqs = [
    {
      question: "What makes your oils truly organic?",
      answer:
        "Our oils are traditionally wood-pressed using high-quality seeds, free from chemicals, preservatives, and artificial refining processes.",
    },
    {
      question: "Are your oils cold pressed?",
      answer:
        "Yes. All our edible oils are extracted using cold-press methods to preserve nutrients, aroma, and natural taste.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Orders are usually delivered within 2–5 business days depending on your location. Tracking details are shared after dispatch.",
    },
    {
      question: "Are your products safe for daily cooking?",
      answer:
        "Absolutely. Our oils, seeds, and pickles are made using traditional methods and are ideal for everyday consumption.",
    },
    {
      question: "Do you ship across India?",
      answer:
        "Yes, we deliver across India. For bulk or wholesale orders, please contact our support team.",
    },
  ];

  const toggleFaq = (index) =>
    setActiveFaq(activeFaq === index ? null : index);

  /* ================= LOAD SETTINGS ================= */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getPublicSettings();
        const data = res.data.settings;

        setSettings({
          storeName: data?.storeName || "Pristine Organic Oils",
          supportEmail: data?.supportEmail || "support@organicstore.com",
          supportPhone: data?.supportPhone || "0000000000",
          address: data?.address || "India",
        });
      } catch (err) {
        console.log("Settings Load Error:", err);
      }
    };

    loadSettings();
  }, []);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!form.name || !form.email || !form.phone || !form.message) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }
    if (!emailRegex.test(form.email)) {
      Swal.fire("Error", "Enter a valid email!", "error");
      return;
    }
    if (!phoneRegex.test(form.phone)) {
      Swal.fire("Error", "Enter a valid 10-digit phone number!", "error");
      return;
    }

    try {
      setLoading(true);

      await submitContactMessageApi(form);

      Swal.fire(
        "Thank you!",
        "We received your message. Our team will contact you shortly 🌿",
        "success"
      );

      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>Contact {settings.storeName} | Organic Cold Pressed Oils</title>
        <meta
          name="description"
          content="Contact Pristine Organic Oils for cold pressed oils, organic seeds, and traditional pickles. Reach us for support, bulk orders, or queries."
        />
        <meta
          name="keywords"
          content="organic oils contact, cold pressed oils support, wood pressed oil supplier, organic food contact"
        />
        <link rel="canonical" href="/contact" />
      </Helmet>

      <div className="bg-[#faf8f6] min-h-screen pb-20">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto px-6 py-10 text-center md:text-left"
        >
          <h1 className="text-4xl font-extrabold text-[#2f6a31] tracking-tight">
            Contact {settings.storeName}
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Reach out for organic oils, seeds & traditional products 🌿
          </p>
        </motion.div>

        {/* ================= CONTACT + FORM ================= */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {[ 
              { icon: FiMail, label: "Email", value: settings.supportEmail },
              { icon: FiPhone, label: "Phone", value: settings.supportPhone },
              { icon: FiMapPin, label: "Address", value: settings.address },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-[#e6efe6] rounded-2xl p-6 flex items-center gap-4"
              >
                <item.icon className="text-[#8fbc8f]" size={22} />
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">
                    {item.label}
                  </h3>
                  <p className="text-xs text-gray-500 whitespace-pre-line">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* SOCIAL */}
            <div className="flex gap-3 pt-4">
              {[FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter].map(
                (Icon, i) => (
                  <a
                    key={i}
                    className="w-9 h-9 bg-white border border-[#e6efe6] rounded-full
                    flex items-center justify-center text-gray-500
                    hover:bg-[#8fbc8f] hover:text-white transition"
                  >
                    <Icon size={12} />
                  </a>
                )
              )}
            </div>
          </motion.div>

          {/* FORM */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-white border border-[#e6efe6] rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold text-[#2f6a31]">
              Send Us a Message
            </h2>

            {["name", "email", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={`Your ${field}`}
                className="w-full border rounded-lg px-4 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#8fbc8f]/40"
              />
            ))}

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message..."
              className="w-full border rounded-lg p-4 h-28 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#8fbc8f]/40"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8fbc8f] text-white rounded-full py-3
              font-semibold text-sm hover:bg-[#93c572] transition
              flex justify-center items-center gap-2 disabled:bg-gray-400"
            >
              <FiSend size={15} />
              {loading ? "Sending..." : "Submit"}
            </button>
          </motion.form>
        </div>

        {/* ================= FAQ ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 mt-16"
        >
          <h2 className="text-3xl font-extrabold text-[#2f6a31] text-center mb-8">
            Frequently Asked Questions
          </h2>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[#e6efe6] rounded-xl mb-4"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <span className="font-medium text-gray-800">
                  {faq.question}
                </span>
                <FiChevronDown
                  className={`transition-transform ${
                    activeFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeFaq === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4 text-sm text-gray-600"
                >
                  {faq.answer}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default ContactUs;
