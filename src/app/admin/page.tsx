"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PhoneCall,
  Package,
  Layers,
  Car,
  Settings,
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Check,
  LogOut,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Globe,
  MapPin,
  Save,
  Plus,
  Trash2,
  Edit,
  UserCheck,
  UserX,
  Users,
  UserPlus,
  Lock,
  Phone,
  Play,
  Upload,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  StopCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  X,
  Film,
  Sliders,
  Boxes,
  PlayCircle,
  Sparkles,
  Star,
  Download,
  Bot,
  Menu,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "orders"
    | "products"
    | "categories"
    | "users"
    | "conversations"
    | "cms"
    | "workingHours"
    | "socials"
    | "stories"
    | "projects"
    | "packages"
    | "reviews"
    | "audit"
    | "faq"
  >("orders");

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data states
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [workingHours, setWorkingHours] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  // Stories, Projects, Packages, Reviews, Audit, and FAQ states
  const [stories, setStories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // FAQ Modal state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    keywords: "",
    category: "GENERAL",
  });

  // Modals & form states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    titleFa: "",
    titleEn: "",
    slug: "",
    sku: "",
    shortDesc: "",
    priceStatus: "INQUIRY",
    price: "",
    stockStatus: "AVAILABLE",
    warranty: "۲۴ ماه گارانتی تعویض طلایی",
    installation: "نصب سوکت به سوکت بدون تداخل در سیم‌کشی",
    categoryId: "",
    imageUrl: "",
    audioUrl: "",
  });

  // Stories Form
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [storyForm, setStoryForm] = useState({
    title: "",
    mediaUrl: "",
    mediaType: "IMAGE",
    linkUrl: "",
  });

  // Projects Form
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    slug: "",
    vehicleName: "",
    description: "",
    coverImage: "",
    beforeImage: "",
    afterImage: "",
  });

  // Packages Form
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageForm, setPackageForm] = useState({
    titleFa: "",
    slug: "",
    description: "",
    image: "",
    priceStatus: "INQUIRY",
    price: "",
  });

  // Upload and Voice Recording states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [mediaRecorderRef, setMediaRecorderRef] = useState<MediaRecorder | null>(null);

  // Category Form
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    nameFa: "",
    slug: "",
    parentId: "",
  });

  // New Admin Form
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    phone: "",
    password: "",
    role: "ADMIN",
  });

  // Chat Reply
  const [replyText, setReplyText] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [searchOrder, setSearchOrder] = useState("");

  // 1. Verify admin session on mount
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((res) => {
        if (!res.authenticated) {
          router.push("/admin/login");
        } else {
          setCurrentUser(res.user);
          fetchAllAdminData();
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => setAuthLoading(false));
  }, [router]);

  const fetchAllAdminData = async () => {
    try {
      const [
        ordersRes,
        productsRes,
        catsRes,
        usersRes,
        chatsRes,
        settingsRes,
        storiesRes,
        projectsRes,
        packagesRes,
        reviewsRes,
        auditRes,
        faqsRes,
      ] = await Promise.all([
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/conversations").then((r) => r.json()),
        fetch("/api/site-settings").then((r) => r.json()),
        fetch("/api/admin/stories").then((r) => r.json()),
        fetch("/api/admin/projects").then((r) => r.json()),
        fetch("/api/admin/packages").then((r) => r.json()),
        fetch("/api/admin/reviews").then((r) => r.json()),
        fetch("/api/admin/audit-logs").then((r) => r.json()),
        fetch("/api/admin/faq").then((r) => r.json()),
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      if (productsRes.success) setProducts(productsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (chatsRes.success) setConversations(chatsRes.data);
      if (storiesRes.success) setStories(storiesRes.data);
      if (projectsRes.success) setProjects(projectsRes.data);
      if (packagesRes.success) setPackages(packagesRes.data);
      if (reviewsRes.success) setReviews(reviewsRes.data);
      if (auditRes.success) setAuditLogs(auditRes.data);
      if (faqsRes.success) setFaqs(faqsRes.data);
      if (settingsRes.success) {
        setSiteSettings(settingsRes.data.setting || {});
        setWorkingHours(settingsRes.data.workingHours || []);
        setSocialLinks(settingsRes.data.socialLinks || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Voice recording timer
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // File Upload Handler (Image & Audio)
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "audio"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (type === "image") setIsUploadingImage(true);
    else setIsUploadingAudio(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === "image") {
          setProductForm((prev) => ({ ...prev, imageUrl: data.url }));
          showNotification("تصویر محصول با موفقیت آپلود گردید");
        } else {
          setProductForm((prev) => ({ ...prev, audioUrl: data.url }));
          showNotification("فایل صوتی توضیحات با موفقیت آپلود گردید");
        }
      } else {
        alert(data.error || "خطا در آپلود فایل");
      }
    } catch (err) {
      alert("خطای ارتباط با سرور هنگام آپلود فایل");
    } finally {
      if (type === "image") setIsUploadingImage(false);
      else setIsUploadingAudio(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        showNotification("فایل با موفقیت آپلود گردید");
        return data.url;
      }
      alert(data.error || "خطا در آپلود فایل");
      return null;
    } catch {
      alert("خطای ارتباط با سرور هنگام آپلود فایل");
      return null;
    }
  };

  // Live Microphone Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice-expert-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("file", audioFile);
        setIsUploadingAudio(true);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.success && data.url) {
            setProductForm((prev) => ({ ...prev, audioUrl: data.url }));
            showNotification("ویس توضیحات کارشناس با موفقیت ضبط و ذخیره شد");
          } else {
            alert(data.error || "خطا در آپلود صدای ضبط شده");
          }
        } catch (err) {
          alert("خطا در پردازش صدای ضبط شده");
        } finally {
          setIsUploadingAudio(false);
        }

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setMediaRecorderRef(mediaRecorder);
      setIsRecording(true);
      setRecordDuration(0);
    } catch (err) {
      alert("دسترسی به میکروفن فعال نشد. لطفاً دسترسی مرورگر را بررسی نمایید.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef && isRecording) {
      mediaRecorderRef.stop();
      setIsRecording(false);
    }
  };

  // --- PRODUCT CRUD ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      const data = await res.json();
      if (data.success) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductForm({
          titleFa: "",
          titleEn: "",
          slug: "",
          sku: "",
          shortDesc: "",
          priceStatus: "INQUIRY",
          price: "",
          stockStatus: "AVAILABLE",
          warranty: "۲۴ ماه گارانتی تعویض طلایی",
          installation: "نصب سوکت به سوکت بدون تداخل در سیم‌کشی",
          categoryId: "",
          imageUrl: "",
          audioUrl: "",
        });
        fetchAllAdminData();
        showNotification(editingProduct ? "محصول ویرایش شد" : "محصول جدید افزوده شد");
      } else {
        alert(data.error || "خطا در ثبت محصول");
      }
    } catch (e) {
      alert("خطای ارتباط با سرور");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("آیا از حذف قطعی این محصول اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification("محصول با موفقیت حذف گردید");
      }
    } catch (e) {
      alert("خطا در حذف محصول");
    }
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);
    const imgMedia =
      prod.media?.find((m: any) => m.type === "IMAGE")?.url || prod.media?.[0]?.url || "";
    const voiceMedia =
      prod.media?.find((m: any) => m.type === "VOICE" || m.type === "AUDIO")?.url || "";

    setProductForm({
      titleFa: prod.titleFa,
      titleEn: prod.titleEn || "",
      slug: prod.slug,
      sku: prod.sku || "",
      shortDesc: prod.shortDesc || "",
      priceStatus: prod.priceStatus || "INQUIRY",
      price: prod.price ? String(prod.price) : "",
      stockStatus: prod.stockStatus || "AVAILABLE",
      warranty: prod.warranty || "",
      installation: prod.installation || "",
      categoryId: prod.categories?.[0]?.categoryId || "",
      imageUrl: imgMedia,
      audioUrl: voiceMedia,
    });
    setIsProductModalOpen(true);
  };

  // --- CATEGORY CRUD ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsCategoryModalOpen(false);
        setCategoryForm({ nameFa: "", slug: "", parentId: "" });
        fetchAllAdminData();
        showNotification("دسته‌بندی با موفقیت افزوده شد");
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("خطا در افزودن دسته");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("آیا از حذف این دسته اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        fetchAllAdminData();
        showNotification("دسته حذف شد");
      }
    } catch (e) {
      alert("خطا در حذف دسته");
    }
  };

  // --- USER / ADMIN CRUD ---
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      if (data.success) {
        setAdminForm({ fullName: "", phone: "", password: "", role: "ADMIN" });
        fetchAllAdminData();
        showNotification("مدیر جدید با موفقیت ایجاد گردید");
      } else {
        alert(data.error || "خطا در ایجاد ادمین");
      }
    } catch (e) {
      alert("خطای سرور");
    }
  };

  const handleToggleBlockUser = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !currentStatus }),
      });
      if ((await res.json()).success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isBlocked: !currentStatus } : u))
        );
        showNotification(currentStatus ? "کاربر رفع مسدودی شد" : "کاربر مسدود گردید");
      }
    } catch (e) {
      alert("خطا در تغییر وضعیت کاربر");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("آیا کاربر حذف شود؟")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if ((await res.json()).success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showNotification("کاربر حذف شد");
      }
    } catch (e) {
      alert("خطا در حذف کاربر");
    }
  };

  // --- ORDERS ---
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if ((await res.json()).success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showNotification("مرحله پیگیری سفارش تغییر یافت");
      }
    } catch {
      alert("خطا در بروزرسانی وضعیت");
    }
  };

  const handleUpdateAdminNotes = async (orderId: string, currentNotes: string) => {
    const note = prompt("یادداشت و هماهنگی فنی کارشناس برای مشتری (جهت نمایش زنده در سامانه رهگیری):", currentNotes || "");
    if (note === null) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: note }),
      });
      if ((await res.json()).success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, adminNotes: note } : o))
        );
        showNotification("یادداشت فنی کارشناس ثبت و در صفحه رهگیری مشتری ذخیره شد");
      }
    } catch {
      alert("خطا در ثبت یادداشت");
    }
  };

  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      alert("سفارشی جهت خروجی وجود ندارد");
      return;
    }
    const headers = ["کد رهگیری", "نام متقاضی", "شماره تماس", "آبشن انتخابی", "خودرو", "وضعیت", "تاریخ ثبت", "یادداشت فنی"];
    const rows = orders.map((o) => [
      o.trackingCode || "",
      `"${(o.customerName || "").replace(/"/g, '""')}"`,
      `"${o.customerPhone || ""}"`,
      `"${(o.product?.titleFa || o.package?.titleFa || "مشاوره عمومی").replace(/"/g, '""')}"`,
      `"${(o.vehicleInfo || "").replace(/"/g, '""')}"`,
      o.status || "",
      new Date(o.createdAt).toLocaleDateString("fa-IR"),
      `"${(o.adminNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `caroption-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("فایل اکسل/CSV سفارشات با موفقیت دانلود شد");
  };

  // --- CHAT REPLY ---
  const handleSendChatReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const res = await fetch("/api/admin/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversationId || "general-support",
          content: replyText,
        }),
      });
      if ((await res.json()).success) {
        setReplyText("");
        fetchAllAdminData();
        showNotification("پاسخ شما برای کاربر ارسال گردید");
      }
    } catch (e) {
      alert("خطا در ارسال پاسخ");
    }
  };

  // --- CMS SAVE ---
  const handleSaveCMS = async () => {
    try {
      const res = await fetch("/api/site-settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setting: siteSettings,
          workingHours,
          socialLinks,
        }),
      });
      if ((await res.json()).success) {
        showNotification("تنظیمات با موفقیت ذخیره شد");
      }
    } catch (e) {
      alert("خطا در ذخیره تنظیمات");
    }
  };

  // --- STORIES CRUD ---
  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsStoryModalOpen(false);
        setStoryForm({ title: "", mediaUrl: "", mediaType: "IMAGE", linkUrl: "" });
        fetchAllAdminData();
        showNotification("استوری جدید با موفقیت منتشر گردید");
      } else {
        alert(data.error || "خطا در ثبت استوری");
      }
    } catch (e) {
      alert("خطای سرور");
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm("آیا از حذف این استوری اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/stories/${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        setStories((prev) => prev.filter((s) => s.id !== id));
        showNotification("استوری حذف شد");
      }
    } catch (e) {
      alert("خطا در حذف استوری");
    }
  };

  // --- PROJECTS CRUD ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsProjectModalOpen(false);
        setProjectForm({
          title: "",
          slug: "",
          vehicleName: "",
          description: "",
          coverImage: "",
          beforeImage: "",
          afterImage: "",
        });
        fetchAllAdminData();
        showNotification("پروژه قبل و بعد جدید با موفقیت ثبت شد");
      } else {
        alert(data.error || "خطا در ثبت پروژه");
      }
    } catch (e) {
      alert("خطای سرور");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("آیا از حذف این پروژه اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showNotification("پروژه حذف شد");
      }
    } catch (e) {
      alert("خطا در حذف پروژه");
    }
  };

  // --- PACKAGES CRUD ---
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsPackageModalOpen(false);
        setPackageForm({
          titleFa: "",
          slug: "",
          description: "",
          image: "",
          priceStatus: "INQUIRY",
          price: "",
        });
        fetchAllAdminData();
        showNotification("پکیج جدید با موفقیت افزوده شد");
      } else {
        alert(data.error || "خطا در ثبت پکیج");
      }
    } catch (e) {
      alert("خطای سرور");
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("آیا از حذف این پکیج اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
        showNotification("پکیج حذف شد");
      }
    } catch (e) {
      alert("خطا در حذف پکیج");
    }
  };

  // --- REVIEWS MODERATION ---
  const handleToggleApproveReview = async (reviewId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if ((await res.json()).success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, isApproved: !currentStatus } : r))
        );
        showNotification(currentStatus ? "دیدگاه رد شد (غیرفعال گردید)" : "دیدگاه تایید و در سایت منتشر شد");
      }
    } catch {
      alert("خطا در تغییر وضعیت دیدگاه");
    }
  };

  const handleToggleVerifiedCustomer = async (reviewId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerifiedCustomer: !currentStatus }),
      });
      if ((await res.json()).success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, isVerifiedCustomer: !currentStatus } : r))
        );
        showNotification(currentStatus ? "برچسب خرید تایید شده حذف شد" : "برچسب خرید تایید شده اضافه گردید");
      }
    } catch {
      alert("خطا در تغییر برچسب مشتری");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("آیا از حذف قطعی این دیدگاه اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      if ((await res.json()).success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        showNotification("دیدگاه کاربر حذف گردید");
      }
    } catch {
      alert("خطا در حذف دیدگاه");
    }
  };

  // --- CHATBOT FAQ KNOWLEDGE BASE ---
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsFaqModalOpen(false);
        setFaqForm({ question: "", answer: "", keywords: "", category: "GENERAL" });
        fetchAllAdminData();
        showNotification("دانش جدید به ربات هوش مصنوعی افزوده شد");
      } else {
        alert(data.error || "خطا در ثبت سوال");
      }
    } catch {
      alert("خطای ارتباط با سرور");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("آیا از حذف این پرسش و پاسخ هوشمند اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        showNotification("پرسش از پایگاه دانش حذف شد");
      }
    } catch {
      alert("خطا در حذف سوال");
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F15] text-white flex items-center justify-center text-sm">
        در حال بررسی دسترسی مدیر ارشد...
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    const q = searchOrder.toLowerCase();
    return (
      o.trackingCode?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.includes(q) ||
      o.vehicleInfo?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Admin Nav */}
      <header className="h-16 border-b border-slate-800 bg-[#111722] px-3 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-500 hover:text-white transition-colors"
            aria-label="منوی پنل"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black flex items-center gap-1.5 sm:gap-2">
              <span className="truncate max-w-[140px] sm:max-w-none">پنل مدیریت مهندسی آبشن</span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                ADMIN
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-xs text-slate-400 hidden md:block">
            <span>مدیر ارشد: </span>
            <strong className="text-white">{currentUser?.fullName || currentUser?.phone}</strong>
          </div>

          <Link
            href="/"
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 sm:border-transparent sm:bg-transparent transition-colors"
          >
            <span className="hidden sm:inline">مشاهده سایت</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>

          <button
            onClick={handleLogout}
            title="خروج از پنل"
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* Mobile Horizontal Tabs Bar (Fast navigation without blocking the screen!) */}
      <div className="lg:hidden flex items-center gap-1.5 p-2 bg-[#0B0F15] border-b border-slate-800/80 overflow-x-auto no-scrollbar shrink-0 text-xs">
        {[
          { key: "orders", label: "سفارش‌ها", count: orders.length, icon: PhoneCall },
          { key: "products", label: "محصولات", count: products.length, icon: Package },
          { key: "categories", label: "دسته‌ها", count: categories.length, icon: Layers },
          { key: "users", label: "کاربران", count: users.length, icon: Users },
          { key: "conversations", label: "پیام‌ها", count: conversations.length, icon: MessageSquare },
          { key: "cms", label: "تنظیمات سایت", icon: Settings },
          { key: "workingHours", label: "ساعات کاری", icon: Clock },
          { key: "socials", label: "شبکه‌ها", icon: Globe },
          { key: "stories", label: "استوری‌ها", count: stories.length, icon: Film },
          { key: "projects", label: "پروژه‌ها", count: projects.length, icon: Sliders },
          { key: "packages", label: "پکیج‌ها", count: packages.length, icon: Boxes },
          { key: "reviews", label: "دیدگاه‌ها", count: reviews.length, icon: Star },
          { key: "audit", label: "لاگ‌ها", count: auditLogs.length, icon: ShieldCheck },
          { key: "faq", label: "ربات AI", count: faqs.length, icon: Bot },
        ].map((tab: any) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-md font-black"
                  : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile so it doesn't squish main content!) */}
        <aside className="hidden lg:flex w-64 border-l border-slate-800 bg-[#0B0F15] p-4 flex-col justify-between shrink-0">
          <nav className="space-y-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "orders"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4" />
                <span>درخواست‌های سفارش</span>
              </div>
              <span className="font-mono text-xs">{orders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "products"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>مدیریت محصولات</span>
              </div>
              <span className="font-mono text-xs">{products.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "categories"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>مدیریت دسته‌بندی‌ها</span>
              </div>
              <span className="font-mono text-xs">{categories.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "users"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>کاربران و مدیران</span>
              </div>
              <span className="font-mono text-xs">{users.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("conversations")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "conversations"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>گفتگوها و پیام‌های صوتی</span>
              </div>
              <span className="font-mono text-xs">{conversations.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("cms")}
              className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                activeTab === "cms"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>هدر، فوتر و متون سایت</span>
            </button>

            <button
              onClick={() => setActiveTab("workingHours")}
              className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                activeTab === "workingHours"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>ساعات کاری و پذیرش</span>
            </button>

            <button
              onClick={() => setActiveTab("socials")}
              className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                activeTab === "socials"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>شبکه‌ها (ایتا، روبیکا...)</span>
            </button>

            <button
              onClick={() => setActiveTab("stories")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "stories"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4" />
                <span>استوری‌های سایت</span>
              </div>
              <span className="font-mono text-xs">{stories.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "projects"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4" />
                <span>پروژه‌ها (Before/After)</span>
              </div>
              <span className="font-mono text-xs">{projects.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("packages")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "packages"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Boxes className="w-4 h-4" />
                <span>پکیج‌های تجهیز خودرو</span>
              </div>
              <span className="font-mono text-xs">{packages.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "reviews"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4" />
                <span>دیدگاه‌ها و امتیازات</span>
              </div>
              <span className="font-mono text-xs">{reviews.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "audit"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>لاگ‌های امنیتی (Audit)</span>
              </div>
              <span className="font-mono text-xs">{auditLogs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("faq")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === "faq"
                  ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4" />
                <span>دانش ربات هوش مصنوعی</span>
              </div>
              <span className="font-mono text-xs">{faqs.length}</span>
            </button>
          </nav>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="block font-bold text-slate-200">وضعیت دسترسی: Super Admin</span>
            <span className="block font-mono text-[10px]">موبایل: {currentUser?.phone}</span>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer Panel */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end" dir="rtl">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside
              style={{ right: 0, left: "auto" }}
              className="fixed top-0 bottom-0 right-0 w-[84vw] max-w-[320px] h-full bg-[#0B0F15] text-white p-4 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto border-l border-slate-800 animate-in slide-in-from-right duration-300"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    <span className="font-black text-sm text-white">منوی پنل مدیریت</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1 text-xs font-bold">
                  {[
                    { key: "orders", label: "درخواست‌های سفارش", count: orders.length, icon: PhoneCall },
                    { key: "products", label: "مدیریت محصولات", count: products.length, icon: Package },
                    { key: "categories", label: "مدیریت دسته‌بندی‌ها", count: categories.length, icon: Layers },
                    { key: "users", label: "کاربران و مدیران", count: users.length, icon: Users },
                    { key: "conversations", label: "گفتگوها و پیام‌های صوتی", count: conversations.length, icon: MessageSquare },
                    { key: "cms", label: "هدر، فوتر و متون سایت", icon: Settings },
                    { key: "workingHours", label: "ساعات کاری و پذیرش", icon: Clock },
                    { key: "socials", label: "شبکه‌ها (ایتا، روبیکا...)", icon: Globe },
                    { key: "stories", label: "استوری‌های سایت", count: stories.length, icon: Film },
                    { key: "projects", label: "پروژه‌ها (Before/After)", count: projects.length, icon: Sliders },
                    { key: "packages", label: "پکیج‌های تجهیز خودرو", count: packages.length, icon: Boxes },
                    { key: "reviews", label: "دیدگاه‌ها و امتیازات", count: reviews.length, icon: Star },
                    { key: "audit", label: "لاگ‌های امنیتی (Audit)", count: auditLogs.length, icon: ShieldCheck },
                    { key: "faq", label: "دانش ربات هوش مصنوعی", count: faqs.length, icon: Bot },
                  ].map((item: any) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.key);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span className="font-mono text-xs">{item.count}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1 mt-4">
                <span className="block font-bold text-slate-200">وضعیت دسترسی: Super Admin</span>
                <span className="block font-mono text-[10px]">موبایل: {currentUser?.phone}</span>
              </div>
            </aside>
          </div>
        )}

        {/* Content Area - 100% full width on mobile! */}
        <main className="w-full flex-1 p-3.5 sm:p-6 overflow-y-auto min-w-0">
          {saveSuccess && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {/* Top KPI Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-[#111722] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold block">کل درخواست‌های استعلام</span>
                <strong className="text-xl font-black text-white font-mono mt-1 block">{orders.length}</strong>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111722] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-400 font-bold block">در انتظار بررسی جدید</span>
                <strong className="text-xl font-black text-amber-400 font-mono mt-1 block">
                  {orders.filter((o) => o.status === "NEW").length}
                </strong>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111722] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold block">کاتالوگ فعال آبشن‌ها</span>
                <strong className="text-xl font-black text-white font-mono mt-1 block">{products.length}</strong>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111722] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold block">رضایت ثبت شده مشتریان</span>
                <strong className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                  {reviews.length > 0
                    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) + " / ۵"
                    : "۵.۰ / ۵"}
                </strong>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Star className="w-5 h-5 fill-emerald-400" />
              </div>
            </div>
          </div>

          {/* TAB 1: ORDER REQUESTS */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111722] p-4 rounded-2xl border border-slate-800">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="جستجو با کد پیگیری، نام یا شماره..."
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    className="w-full px-3 py-2 pl-9 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    تعداد درخواست‌ها: <strong>{orders.length}</strong>
                  </span>
                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>خروجی اکسل (CSV)</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#111722] overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase font-mono">
                    <tr>
                      <th className="p-4">کد رهگیری</th>
                      <th className="p-4">نام متقاضی</th>
                      <th className="p-4">شماره تماس</th>
                      <th className="p-4">آبشن انتخابی</th>
                      <th className="p-4">خودرو</th>
                      <th className="p-4">وضعیت</th>
                      <th className="p-4">اقدام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-amber-400">{o.trackingCode}</td>
                        <td className="p-4 font-bold text-white">{o.customerName}</td>
                        <td className="p-4 font-mono dir-ltr text-left">
                          <a href={`tel:${o.customerPhone}`} className="text-amber-400 hover:underline">
                            {o.customerPhone}
                          </a>
                        </td>
                        <td className="p-4 text-slate-300 max-w-xs truncate">
                          {o.product?.titleFa || o.package?.titleFa || "مشاوره عمومی"}
                        </td>
                        <td className="p-4 text-slate-400">{o.vehicleInfo || "-"}</td>
                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border focus:outline-none cursor-pointer transition-colors ${
                              o.status === "NEW"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : o.status === "UNDER_REVIEW"
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                : o.status === "CONTACTED"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : o.status === "INSTALLING"
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                                : o.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            <option value="NEW" className="bg-slate-900 text-amber-400">۱. ثبت اولیه</option>
                            <option value="UNDER_REVIEW" className="bg-slate-900 text-purple-400">۲. بررسی فنی خودرو</option>
                            <option value="CONTACTED" className="bg-slate-900 text-blue-400">۳. هماهنگی و زمان نصب</option>
                            <option value="INSTALLING" className="bg-slate-900 text-orange-400">۴. در حال نصب در کارگاه</option>
                            <option value="COMPLETED" className="bg-slate-900 text-emerald-400">۵. تحویل و گارانتی</option>
                            <option value="CANCELLED" className="bg-slate-900 text-rose-400">لغو سفارش</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateAdminNotes(o.id, o.adminNotes || "")}
                              title={o.adminNotes ? `یادداشت کارشناس: ${o.adminNotes}` : "ثبت یادداشت فنی کارشناس برای مشتری"}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                                o.adminNotes
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950"
                                  : "bg-slate-800 text-slate-400 hover:text-white"
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span className="text-[10px]">
                                {o.adminNotes ? "یادداشت فنی ✓" : "+ یادداشت"}
                              </span>
                            </button>

                            <Link
                              href={`/tracking?code=${o.trackingCode}`}
                              target="_blank"
                              title="مشاهده صفحه رهگیری زنده این سفارش"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">مدیریت، ویرایش و حذف محصولات</h3>
                  <span className="text-xs text-slate-400">تعداد محصولات ثبت شده: {products.length}</span>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  افزودن محصول جدید
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => {
                  const imgUrl =
                    p.media?.find((m: any) => m.type === "IMAGE")?.url || p.media?.[0]?.url;
                  const voiceUrl =
                    p.media?.find((m: any) => m.type === "VOICE" || m.type === "AUDIO")?.url;
                  const categoryName = p.categories?.[0]?.category?.nameFa;

                  return (
                    <div
                      key={p.id}
                      className="group rounded-2xl bg-[#111722] border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300"
                    >
                      {/* Product Image Thumbnail */}
                      <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={p.titleFa}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-1.5">
                            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                            <span className="text-[11px]">تصویری ثبت نشده</span>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1.5">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold border border-slate-750">
                            {p.sku}
                          </span>
                          {categoryName && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-800">
                              {categoryName}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md ${
                              p.stockStatus === "AVAILABLE"
                                ? "bg-emerald-500/90 text-slate-950"
                                : p.stockStatus === "ON_ORDER"
                                ? "bg-amber-500/90 text-slate-950"
                                : "bg-rose-500/90 text-white"
                            }`}
                          >
                            {p.stockStatus === "AVAILABLE"
                              ? "موجود"
                              : p.stockStatus === "ON_ORDER"
                              ? "سفارشی"
                              : "ناموجود"}
                          </span>
                        </div>

                        {/* Voice Badge on Image */}
                        {voiceUrl && (
                          <div className="absolute bottom-2.5 right-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow-lg">
                              <Volume2 className="w-3 h-3" />
                              ویس کارشناسی
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info & Details */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                            {p.titleFa}
                          </h4>
                          {p.shortDesc && (
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                              {p.shortDesc}
                            </p>
                          )}
                        </div>

                        {/* Inline Voice Player if exists */}
                        {voiceUrl && (
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-1">
                            <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                              <Mic className="w-3 h-3" />
                              پخش ویس کارشناسی محصول:
                            </span>
                            <audio controls src={voiceUrl} className="w-full h-8" />
                          </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs mt-2">
                          <span className="text-slate-300 font-bold font-mono">
                            {p.priceStatus === "SHOW_PRICE" && p.price
                              ? `${p.price.toLocaleString("fa-IR")} ت`
                              : "استعلام قیمت"}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                              title="مشاهده صفحه محصول در سایت"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors"
                              title="ویرایش محصول"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 transition-colors"
                              title="حذف محصول"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES CRUD */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">مدیریت دسته‌بندی‌ها و زیردسته‌ها</h3>
                  <span className="text-xs text-slate-400">ساختار منوی کشویی سایت</span>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  افزودن دسته‌بندی جدید
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-[#111722] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-amber-400 font-bold">{cat.nameFa}</strong>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف
                      </button>
                    </div>
                    <span className="block text-[11px] font-mono text-slate-500">/{cat.slug}</span>

                    {cat.children && cat.children.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[11px] text-slate-400 block font-bold">زیردسته‌ها:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.children.map((sub: any) => (
                            <span
                              key={sub.id}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                            >
                              {sub.nameFa}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: USERS & ADMINS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Add New Admin Form */}
              <div className="p-6 rounded-2xl bg-[#111722] border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-500" />
                  افزودن مدیر جدید و تعیین سطح دسترسی
                </h3>

                <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">نام و نام خانوادگی مدیر</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مهندس حسینی"
                      value={adminForm.fullName}
                      onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">شماره موبایل جهت ورود</label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="0912xxxxxxx"
                      value={adminForm.phone}
                      onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">رمز عبور اختصاصی</label>
                    <input
                      type="password"
                      required
                      dir="ltr"
                      placeholder="••••••••"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                    >
                      ثبت ادمین جدید
                    </button>
                  </div>
                </form>
              </div>

              {/* Users List & Controls */}
              <div className="rounded-2xl border border-slate-800 bg-[#111722] overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">لیست تمامی کاربران و مدیران ثبت شده</h4>
                  <span className="text-xs text-slate-400">{users.length} کاربر</span>
                </div>

                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-4">نام کاربر</th>
                      <th className="p-4">شماره موبایل</th>
                      <th className="p-4">نقش دسترسی</th>
                      <th className="p-4">وضعیت حساب</th>
                      <th className="p-4">عملیات محدودسازی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-white">{u.fullName || "کاربر سایت"}</td>
                        <td className="p-4 font-mono dir-ltr text-left text-slate-300">{u.phone}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "ADMIN"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {u.role === "ADMIN" ? "مدیر سیستم" : "کاربر عادی"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.isBlocked ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {u.isBlocked ? "مسدود شده" : "فعال"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleBlockUser(u.id, u.isBlocked)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                u.isBlocked
                                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950"
                                  : "bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                              }`}
                              title={u.isBlocked ? "رفع مسدودی" : "مسدودسازی کاربر"}
                            >
                              {u.isBlocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white"
                              title="حذف کاربر"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CONVERSATIONS & VOICE MESSAGES */}
          {activeTab === "conversations" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#111722] border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">مرکز گفتگوها، تیکت‌ها و پیام‌های صوتی</h3>
                  <span className="text-xs text-slate-400">شنیدن پیام‌های صوتی کاربران و پاسخگویی</span>
                </div>
              </div>

              {/* Chat Reply Form */}
              <div className="p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <form onSubmit={handleSendChatReply} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="پاسخ مدیریت به پیام‌های کاربران را اینجا بنویسید..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    ارسال پاسخ
                  </button>
                </form>
              </div>

              {/* Messages Feed */}
              <div className="rounded-2xl border border-slate-800 bg-[#111722] p-4 space-y-3">
                {conversations.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      m.senderType === "ADMIN"
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-2">
                        {m.senderName || "کاربر مهمان"}
                        <span className="text-[10px] text-slate-500 font-mono">({m.senderType})</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {new Date(m.createdAt).toLocaleTimeString("fa-IR")}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed">{m.content}</p>

                    {/* Audio Player for Voice Messages */}
                    {m.attachments?.map((att: any, idx: number) => (
                      <div key={idx} className="mt-2 p-2 rounded-xl bg-black/30 flex items-center gap-3">
                        {att.fileType === "VOICE" && (
                          <div className="w-full flex items-center gap-2">
                            <span className="text-[11px] text-amber-400 font-bold">پیام صوتی (وویس کاربر):</span>
                            <audio controls src={att.fileUrl} className="h-8 flex-1" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SITE CMS SETTINGS */}
          {activeTab === "cms" && (
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-base font-bold text-white">مدیریت داینامیک متون، هدر، فوتر و نقشه</h2>
                <button
                  onClick={handleSaveCMS}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  ذخیره تغییرات
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#111722] border border-slate-800 space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">نام برند و سایت</label>
                  <input
                    type="text"
                    value={siteSettings.siteName || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">شعار و زیرعنوان سایت</label>
                  <input
                    type="text"
                    value={siteSettings.siteTagline || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteTagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1.5">شماره تلفن ثابت مشاوره</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={siteSettings.phone || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1.5">ایمیل پشتیبانی</label>
                    <input
                      type="email"
                      dir="ltr"
                      value={siteSettings.email || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">آدرس حضوری کارگاه و استودیو (در فوتر)</label>
                  <input
                    type="text"
                    value={siteSettings.address || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1.5">عرض جغرافیایی نقشه (Latitude)</label>
                    <input
                      type="number"
                      step="0.0001"
                      dir="ltr"
                      value={siteSettings.mapLat || 35.7412}
                      onChange={(e) => setSiteSettings({ ...siteSettings, mapLat: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1.5">طول جغرافیایی نقشه (Longitude)</label>
                    <input
                      type="number"
                      step="0.0001"
                      dir="ltr"
                      value={siteSettings.mapLng || 51.4289}
                      onChange={(e) => setSiteSettings({ ...siteSettings, mapLng: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: WORKING HOURS */}
          {activeTab === "workingHours" && (
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-base font-bold text-white">مدیریت ساعات کاری و پذیرش خودرو</h2>
                <button
                  onClick={handleSaveCMS}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  ذخیره ساعات
                </button>
              </div>

              <div className="space-y-3">
                {workingHours.map((h, idx) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl bg-[#111722] border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={h.isOpen}
                        onChange={(e) => {
                          const updated = [...workingHours];
                          updated[idx].isOpen = e.target.checked;
                          setWorkingHours(updated);
                        }}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span className="font-bold text-white w-20">{h.dayName}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span>از:</span>
                      <input
                        type="text"
                        value={h.openTime}
                        onChange={(e) => {
                          const updated = [...workingHours];
                          updated[idx].openTime = e.target.value;
                          setWorkingHours(updated);
                        }}
                        className="w-20 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center text-white"
                      />
                      <span>تا:</span>
                      <input
                        type="text"
                        value={h.closeTime}
                        onChange={(e) => {
                          const updated = [...workingHours];
                          updated[idx].closeTime = e.target.value;
                          setWorkingHours(updated);
                        }}
                        className="w-20 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SOCIALS */}
          {activeTab === "socials" && (
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-base font-bold text-white">شبکه‌های اجتماعی (ایتا، روبیکا...)</h2>
                <button
                  onClick={handleSaveCMS}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  ذخیره شبکه‌ها
                </button>
              </div>

              <div className="space-y-4">
                {socialLinks.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-[#111722] border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-400 text-sm">{s.title}</strong>
                      <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={s.isActive}
                          onChange={(e) => {
                            const updated = [...socialLinks];
                            updated[idx].isActive = e.target.checked;
                            setSocialLinks(updated);
                          }}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span>نمایش در سایت</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">آدرس اینترنتی (URL)</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={s.url}
                          onChange={(e) => {
                            const updated = [...socialLinks];
                            updated[idx].url = e.target.value;
                            setSocialLinks(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">آیدی / شماره</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={s.username || ""}
                          onChange={(e) => {
                            const updated = [...socialLinks];
                            updated[idx].username = e.target.value;
                            setSocialLinks(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: STORIES */}
          {activeTab === "stories" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">مدیریت استوری‌های چندرسانه‌ای</h3>
                  <span className="text-xs text-slate-400">استوری‌های بالای صفحه اصلی سایت</span>
                </div>
                <button
                  onClick={() => setIsStoryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  افزودن استوری جدید
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {stories.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-2xl bg-[#111722] border border-slate-800 space-y-2 flex flex-col justify-between"
                  >
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                      <img
                        src={st.mediaUrl}
                        alt={st.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 text-[10px] bg-slate-950/80 px-2 py-0.5 rounded text-white font-bold">
                        {st.mediaType}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{st.title}</h4>
                      {st.linkUrl && (
                        <span className="text-[10px] text-amber-500 truncate block font-mono">
                          {st.linkUrl}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteStory(st.id)}
                      className="w-full py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: PROJECTS (BEFORE/AFTER) */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">پروژه‌های اجراشده و گالری قبل و بعد</h3>
                  <span className="text-xs text-slate-400">نمایش تخصص نصب روی مدل‌های مختلف خودرو</span>
                </div>
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  ثبت پروژه جدید
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((pr) => (
                  <div
                    key={pr.id}
                    className="rounded-2xl bg-[#111722] border border-slate-800 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-48 bg-slate-900">
                      <img
                        src={pr.coverImage}
                        alt={pr.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 text-[10px] bg-slate-950/80 text-amber-400 px-2.5 py-1 rounded-full font-bold">
                        {pr.vehicleName}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{pr.title}</h4>
                        {pr.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{pr.description}</p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {pr.beforeImage && pr.afterImage ? "دارای اسلایدر قبل/بعد" : "پروژه تصویری"}
                        </span>
                        <button
                          onClick={() => handleDeleteProject(pr.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                          title="حذف پروژه"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: PACKAGES */}
          {activeTab === "packages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">پکیج‌های مهندسی تجهیز خودرو</h3>
                  <span className="text-xs text-slate-400">بسته‌های ویژه رفاهی، صوتی و ایمنی</span>
                </div>
                <button
                  onClick={() => setIsPackageModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  افزودن پکیج جدید
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl bg-[#111722] border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      {pkg.image && (
                        <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-900">
                          <img
                            src={pkg.image}
                            alt={pkg.titleFa}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h4 className="text-sm font-bold text-white">{pkg.titleFa}</h4>
                      {pkg.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{pkg.description}</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold font-mono">
                        {pkg.price ? `${pkg.price.toLocaleString("fa-IR")} تومان` : "استعلام قیمت"}
                      </span>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                        title="حذف پکیج"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: REVIEWS MODERATION */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    مدیریت و تایید دیدگاه‌های کاربران و مشتریان
                  </h3>
                  <span className="text-xs text-slate-400">
                    بررسی نظرات ثبت شده برای محصولات، تایید انتشار، اعطای نشان مشتری تایید شده و حذف
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
                  {reviews.length} دیدگاه
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#111722] border border-slate-800 text-slate-500 text-xs">
                  هنوز دیدگاهی ثبت نشده است. دیدگاه‌های ارسالی کاربران در صفحه محصولات در اینجا قرار می‌گیرند.
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`p-4 rounded-2xl border transition-all text-xs space-y-3 ${
                        rev.isApproved
                          ? "bg-[#111722] border-slate-800"
                          : "bg-amber-500/5 border-amber-500/30"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-sm">
                            {rev.authorName || "کاربر ناشناس"}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= rev.rating ? "fill-amber-400" : "text-slate-700"
                                }`}
                              />
                            ))}
                          </div>
                          {rev.product?.titleFa && (
                            <Link
                              href={`/products/${rev.product.slug}`}
                              target="_blank"
                              className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-500 hover:text-amber-400 font-bold"
                            >
                              محصول: {rev.product.titleFa}
                            </Link>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(rev.createdAt).toLocaleDateString("fa-IR")}
                          </span>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              rev.isApproved
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {rev.isApproved ? "✓ تایید شده در سایت" : "در انتظار تایید"}
                          </span>

                          {rev.isVerifiedCustomer && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              مشتری واقعی
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                        {rev.comment}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleApproveReview(rev.id, rev.isApproved)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                              rev.isApproved
                                ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                            }`}
                          >
                            {rev.isApproved ? "عدم تایید (مخفی‌سازی)" : "تایید و انتشار دیدگاه"}
                          </button>

                          <button
                            onClick={() => handleToggleVerifiedCustomer(rev.id, rev.isVerifiedCustomer)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-colors border ${
                              rev.isVerifiedCustomer
                                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                            }`}
                          >
                            {rev.isVerifiedCustomer ? "حذف نشان خریدار تایید شده" : "اعطای نشان خریدار تایید شده"}
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                          title="حذف دیدگاه"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 13: AUDIT & SECURITY LOGS */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    لاگ‌های امنیتی و رویدادهای سیستمی (Audit Trail)
                  </h3>
                  <span className="text-xs text-slate-400">
                    ثبت دقیق تغییرات سفارش‌ها، آپدیت محصولات، مسدودسازی کاربران و فعالیت مدیران
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
                  {auditLogs.length} رویداد ثبت شده
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#111722] overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-4">نوع عملیات (Action)</th>
                      <th className="p-4">بخش مربوطه (Resource)</th>
                      <th className="p-4">کاربر / مجری</th>
                      <th className="p-4">جزئیات تغییرات</th>
                      <th className="p-4">زمان ثبت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/40">
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.action?.includes("DELETE")
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : log.action?.includes("UPDATE")
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-white font-bold">{log.resource}</td>
                        <td className="p-4 text-slate-300 font-sans">
                          {log.user?.fullName || log.user?.phone || "سیستم مرکزی"}
                        </td>
                        <td className="p-4 text-slate-400 font-sans max-w-xs truncate">
                          {log.details || "-"}
                        </td>
                        <td className="p-4 text-slate-500 dir-ltr text-right">
                          {new Date(log.createdAt).toLocaleString("fa-IR")}
                        </td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                          هیچ لاگ سیستمی جدیدی ثبت نشده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 14: CHATBOT FAQ KNOWLEDGE BASE */}
          {activeTab === "faq" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#111722] border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-amber-500" />
                    پایگاه دانش ربات هوش مصنوعی (Chatbot Knowledge Base)
                  </h3>
                  <span className="text-xs text-slate-400">
                    تعریف سوالات متداول، پاسخ‌های هوشمند و کلمات کلیدی محرک جهت پاسخگویی خودکار ربات به کاربران
                  </span>
                </div>
                <button
                  onClick={() => setIsFaqModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  افزودن پرسش و پاسخ جدید
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-5 rounded-2xl bg-[#111722] border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {faq.category || "GENERAL"}
                          </span>
                          <strong className="text-white text-sm font-bold">{faq.question}</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                        title="حذف این پرسش"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                      {faq.answer}
                    </p>

                    {faq.keywords && (
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="text-[11px] text-slate-500">کلمات کلیدی محرک:</span>
                        {faq.keywords.split(",").map((kw: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono"
                          >
                            #{kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {faqs.length === 0 && (
                  <div className="p-12 text-center rounded-2xl bg-[#111722] border border-slate-800 text-slate-500 text-xs">
                    هنوز سوالی ثبت نشده است. روی دکمه «افزودن پرسش و پاسخ جدید» کلیک کنید.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#111722] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-slate-800 text-white space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-black border-b border-slate-800 pb-3">
              {editingProduct ? "ویرایش مشخصات محصول" : "افزودن محصول جدید به کاتالوگ"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">عنوان فارسی محصول *</label>
                  <input
                    type="text"
                    required
                    value={productForm.titleFa}
                    onChange={(e) => setProductForm({ ...productForm, titleFa: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">اسلاگ یکتا (Slug) *</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">توضیح کوتاه فنی</label>
                <textarea
                  rows={2}
                  value={productForm.shortDesc}
                  onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">وضعیت قیمت</label>
                  <select
                    value={productForm.priceStatus}
                    onChange={(e) => setProductForm({ ...productForm, priceStatus: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="INQUIRY">استعلام قیمت فنی</option>
                    <option value="SHOW_PRICE">نمایش قیمت ریالی</option>
                    <option value="CALL">تماس بگیرید</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">قیمت عددی (تومان)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">وضعیت موجودی</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="AVAILABLE">موجود جهت نصب</option>
                    <option value="ON_ORDER">فقط با سفارش قبلی</option>
                    <option value="OUT_OF_STOCK">ناموجود</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">دسته‌بندی تخصصی محصول</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">انتخاب دسته‌بندی...</option>
                  {categories.map((c) => (
                    <React.Fragment key={c.id}>
                      <option value={c.id} className="font-bold text-amber-400">
                        📁 {c.nameFa}
                      </option>
                      {c.children?.map((sub: any) => (
                        <option key={sub.id} value={sub.id} className="text-slate-300">
                          &nbsp;&nbsp;↳ {sub.nameFa}
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                </select>
              </div>

              {/* IMAGE UPLOAD & PREVIEW SECTION */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    تصویر اصلی محصول
                  </span>
                  {productForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, imageUrl: "" })}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      حذف تصویر
                    </button>
                  )}
                </div>

                {productForm.imageUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      <img
                        src={productForm.imageUrl}
                        alt="پیش‌نمایش محصول"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[11px] text-emerald-400 font-bold block">
                        ✓ تصویر ثبت گردید
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono break-all line-clamp-2">
                        {productForm.imageUrl}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-colors">
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span>در حال آپلود تصویر...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-amber-400" />
                          <span>آپلود تصویر از کامپیوتر</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage}
                        onChange={(e) => handleUploadFile(e, "image")}
                        className="hidden"
                      />
                    </label>

                    <span className="text-[11px] text-slate-500">یا ثبت آدرس اینترنتی:</span>
                  </div>
                )}

                <input
                  type="text"
                  dir="ltr"
                  placeholder="https://... یا پس از آپلود خودکار پر می‌شود"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* VOICE / AUDIO OVERVIEW SECTION */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Mic className="w-4 h-4" />
                    توضیحات صوتی کارشناس (Audio Voice Note)
                  </span>
                  {productForm.audioUrl && (
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, audioUrl: "" })}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      حذف ویس
                    </button>
                  )}
                </div>

                {productForm.audioUrl ? (
                  <div className="space-y-2">
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      ✓ فایل صوتی توضیحات فعال است:
                    </span>
                    <audio controls src={productForm.audioUrl} className="w-full h-9" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Record Mic Button */}
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          disabled={isUploadingAudio}
                          className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all"
                        >
                          <Mic className="w-4 h-4 text-amber-400" />
                          <span>شروع ضبط زنده صدا با میکروفن</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 animate-pulse shadow-lg shadow-rose-600/30"
                        >
                          <StopCircle className="w-4 h-4" />
                          <span>توقف و ذخیره ویس ({recordDuration} ثانیه)</span>
                        </button>
                      )}

                      {/* Upload Audio File */}
                      <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer border border-slate-700 transition-colors">
                        {isUploadingAudio ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                            <span>در حال آپلود صدا...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-slate-400" />
                            <span>آپلود فایل صوتی (MP3/WAV)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="audio/*"
                          disabled={isUploadingAudio || isRecording}
                          onChange={(e) => handleUploadFile(e, "audio")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      dir="ltr"
                      placeholder="لینک مستقیم فایل صوتی (اختیاری)"
                      value={productForm.audioUrl}
                      onChange={(e) => setProductForm({ ...productForm, audioUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  ذخیره محصول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111722] rounded-3xl p-6 shadow-2xl border border-slate-800 text-white space-y-4">
            <h3 className="text-sm font-bold border-b border-slate-800 pb-3">افزودن دسته‌بندی جدید</h3>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">نام فارسی دسته *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameFa}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameFa: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">اسلاگ لاتین (Slug) *</label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-left focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">دسته والد (اختیاری جهت زیردسته)</label>
                <select
                  value={categoryForm.parentId}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="">دسته اصلی (بدون والد)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameFa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  ثبت دسته
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STORY CREATE MODAL */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111722] rounded-3xl p-6 shadow-2xl border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-amber-500" />
                انتشار استوری جدید
              </h3>
              <button
                onClick={() => setIsStoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">عنوان استوری *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: نصب مانیتور تسلایی روی سانتافه"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">نوع رسانه (مدیا)</label>
                <select
                  value={storyForm.mediaType}
                  onChange={(e) => setStoryForm({ ...storyForm, mediaType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                >
                  <option value="IMAGE">تصویر (Image)</option>
                  <option value="VIDEO">ویدیو (Video)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">فایل مدیا (تصویر / ویدیو) *</label>
                <div className="space-y-2">
                  <label className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>آپلود فایل مدیا</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadSingleFile(file);
                          if (url) setStoryForm((prev) => ({ ...prev, mediaUrl: url }));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    placeholder="یا لینک مستقیم تصویر/ویدیو..."
                    value={storyForm.mediaUrl}
                    onChange={(e) => setStoryForm({ ...storyForm, mediaUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  {storyForm.mediaUrl && (
                    <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {storyForm.mediaType === "VIDEO" ? (
                        <video src={storyForm.mediaUrl} className="h-full w-full object-cover" muted />
                      ) : (
                        <img src={storyForm.mediaUrl} alt="Preview" className="h-full w-full object-cover" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">لینک مرتبط (اختیاری جهت باز شدن صفحه)</label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="https://... یا /products/..."
                  value={storyForm.linkUrl}
                  onChange={(e) => setStoryForm({ ...storyForm, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  انتشار استوری
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT BEFORE/AFTER CREATE MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#111722] rounded-3xl p-6 shadow-2xl border border-slate-800 text-white space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                ثبت پروژه جدید (قبل و بعد نصب)
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">عنوان پروژه *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تعویض مانیتور و سیستم صوتی"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">نام خودرو *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: هیوندای سانتافه ۲۰۱۷"
                    value={projectForm.vehicleName}
                    onChange={(e) => setProjectForm({ ...projectForm, vehicleName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">اسلاگ لاتین (Slug) *</label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="santafe-2017-headunit-upgrade"
                  value={projectForm.slug}
                  onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">توضیحات پروژه و جزئیات نصب</label>
                <textarea
                  rows={3}
                  placeholder="توضیحاتی در مورد آپشن نصب شده، مدت زمان کار و چالش‌های پروژه..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Before and After Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div>
                  <label className="block text-amber-400 font-bold mb-1.5">تصویر قبل از نصب (Before)</label>
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer mb-2">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>آپلود تصویر قبل</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadSingleFile(file);
                          if (url) setProjectForm((prev) => ({ ...prev, beforeImage: url }));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="یا آدرس تصویر..."
                    value={projectForm.beforeImage}
                    onChange={(e) => setProjectForm({ ...projectForm, beforeImage: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                  />
                  {projectForm.beforeImage && (
                    <img src={projectForm.beforeImage} alt="Before" className="mt-2 h-20 w-full object-cover rounded-lg border border-slate-800" />
                  )}
                </div>

                <div>
                  <label className="block text-emerald-400 font-bold mb-1.5">تصویر بعد از نصب (After)</label>
                  <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer mb-2">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>آپلود تصویر بعد</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadSingleFile(file);
                          if (url) setProjectForm((prev) => ({ ...prev, afterImage: url }));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="یا آدرس تصویر..."
                    value={projectForm.afterImage}
                    onChange={(e) => setProjectForm({ ...projectForm, afterImage: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                  />
                  {projectForm.afterImage && (
                    <img src={projectForm.afterImage} alt="After" className="mt-2 h-20 w-full object-cover rounded-lg border border-slate-800" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">تصویر کاور پروژه (اختیاری)</label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="https://... یا در صورت خالی بودن تصویر بعد استفاده می‌شود"
                  value={projectForm.coverImage}
                  onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  ذخیره پروژه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OPTION PACKAGE CREATE MODAL */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#111722] rounded-3xl p-6 shadow-2xl border border-slate-800 text-white space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                افزودن پکیج آپشن اختصاصی
              </h3>
              <button
                onClick={() => setIsPackageModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">نام و عنوان فارسی پکیج *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: پکیج طلایی ایمنی و رادار"
                  value={packageForm.titleFa}
                  onChange={(e) => setPackageForm({ ...packageForm, titleFa: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">اسلاگ پکیج (Slug) *</label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="safety-radar-package"
                  value={packageForm.slug}
                  onChange={(e) => setPackageForm({ ...packageForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">شرح اقلام و مزایای پکیج</label>
                <textarea
                  rows={3}
                  placeholder="شامل رادار نقطه کور، دوربین ۳۶۰ درجه، سنسور جلو..."
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">نوع قیمت‌گذاری</label>
                  <select
                    value={packageForm.priceStatus}
                    onChange={(e) => setPackageForm({ ...packageForm, priceStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="INQUIRY">استعلامی (نیاز به استعلام)</option>
                    <option value="SHOW_PRICE">نمایش قیمت دقیق</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">قیمت عددی (تومان)</label>
                  <input
                    type="number"
                    placeholder="اختیاری..."
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">تصویر کاور پکیج</label>
                <div className="space-y-2">
                  <label className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>آپلود تصویر پکیج</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadSingleFile(file);
                          if (url) setPackageForm((prev) => ({ ...prev, image: url }));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="https://..."
                    value={packageForm.image}
                    onChange={(e) => setPackageForm({ ...packageForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                  />
                  {packageForm.image && (
                    <img src={packageForm.image} alt="Package" className="h-20 w-full object-cover rounded-xl border border-slate-800" />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  ذخیره پکیج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHATBOT FAQ CREATE MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#111722] rounded-3xl p-6 shadow-2xl border border-slate-800 text-white space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-500" />
                افزودن پرسش و پاسخ هوشمند به چت‌بات
              </h3>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">متن پرسش یا سوال کاربر *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: آیا برای نصب مانیتور سیم‌کشی فابریک دستکاری می‌شود؟"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">پاسخ رسمی و فنی ربات به کاربر *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="پاسخ کامل، دقیق و ترغیب‌کننده به استعلام..."
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">دسته‌بندی پرسش</label>
                  <select
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="GENERAL">عمومی و مشاوره</option>
                    <option value="INSTALLATION">نصب و فنی</option>
                    <option value="COMPATIBILITY">سازگاری با خودرو</option>
                    <option value="ORDER">سفارش و استعلام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">کلمات کلیدی محرک (جدا با ویرگول)</label>
                  <input
                    type="text"
                    placeholder="گارانتی, سیم کشی, سوکت, ابطال"
                    value={faqForm.keywords}
                    onChange={(e) => setFaqForm({ ...faqForm, keywords: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  ثبت در پایگاه دانش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
