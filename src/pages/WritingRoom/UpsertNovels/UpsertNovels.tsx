import { useNavigate, useParams } from "react-router-dom";
import type { CreateNovelRequest } from "../../../api/Novels/novel.type";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateNovels, GetNovelByUrl, GetUrlChecked, UpdateNovels } from "../../../api/Novels/novel.api";
import { useAuth } from "../../../hooks/useAuth";
import { getTags } from "../../../api/Tags/tag.api";
import { useToast } from "../../../context/ToastContext/toast-context";
import { urlToFile } from "../../../utils/img";
import { isValidUrl } from "../../../utils/validation";
import { ActionsBar } from "./components/ActionsBar";
import { PreviewCard } from "./components/PreviewCard";

const SLUG_MAX = 30;

const initialCreateNovelForms: CreateNovelRequest = {
  title: "",
  slug: "",
  description: "",
  authorId: "",
  novelImage: null,
  novelBanner: null,
  tags: [],
  status: 0,
  isPublic: false,
  isPaid: false,
  isLock: false,
  allowComment: true,
  price: 0,
};

const slugifyVi = (input: string) =>
  input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX);

export const UpsertNovels = () => {
  const [form, setForm] = useState<CreateNovelRequest>(initialCreateNovelForms);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagQuery, setTagQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string>("");
  const [urlOk, setUrlOk] = useState<string>("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [lastAutoSlug, setLastAutoSlug] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  const { auth } = useAuth();
  const { id } = useParams();
  const isUpdate = Boolean(id);

  const { data: novelData, isSuccess } = useQuery({
    queryKey: ["novel", id],
    queryFn: () => GetNovelByUrl(id!),
    enabled: !!id,
  });

  const { data: slugChecked, refetch: checkSlug, isFetching: isChecking } = useQuery({
    queryKey: ["check-slug", form.slug],
    queryFn: () => GetUrlChecked(form.slug).then((res) => res.data.data),
    enabled: false,
  });

  const { data: tagData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags().then((res) => res.data.data),
  });

  const createNovelMutation = useMutation({
    mutationFn: (fd: FormData) => CreateNovels(fd),
    onSuccess: () => {
      toast?.onOpen("Đã lưu vào kho của bạn");
      navigate("/novels/writing-room");
    },
    onError: () => toast?.onOpen("Có lỗi khi tạo truyện"),
  });

  const updateNovelMutation = useMutation({
    mutationFn: (fd: FormData) => UpdateNovels(fd),
    onSuccess: () => {
      toast?.onOpen("Cập nhật thành công");
      navigate("/novels/writing-room");
    },
    onError: () => toast?.onOpen("Có lỗi khi cập nhật"),
  });

  const filteredTags = useMemo(() => {
    if (!tagData) return [];
    if (!tagQuery.trim()) return tagData;
    const q = tagQuery.toLowerCase();
    return tagData.filter((t: any) => (t.name || t.slug || "").toLowerCase().includes(q));
  }, [tagData, tagQuery]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => {
      const has = prev.includes(tagId);
      if (has) return prev.filter((x) => x !== tagId);
      if (prev.length >= 3) return prev;
      return [...prev, tagId];
    });
  };

  const toFormData = (override: Partial<CreateNovelRequest>): FormData => {
    const fd = new FormData();
    const merged: CreateNovelRequest = { ...form, ...override, tags: selectedTags };
    if (auth?.user?.userId) fd.append("authorId", auth.user.userId);
    fd.append("title", merged.title);
    fd.append("description", merged.description);
    fd.append("slug", merged.slug);
    if (merged.novelImage) fd.append("novelImage", merged.novelImage);
    if (merged.novelBanner) fd.append("novelBanner", merged.novelBanner);
    merged.tags.forEach((t) => fd.append("tags", t));
    fd.append("status", String(merged.status));
    fd.append("isPublic", String(merged.isPublic));
    fd.append("isPaid", String(merged.isPaid));
    fd.append("isLock", String(merged.isLock));
    fd.append("allowComment", String(merged.allowComment));
    fd.append("price", String(merged.price));
    if (isUpdate && id) fd.append("novelId", id);
    return fd;
  };

  const handleSaveDraft = () => {
    const fd = toFormData({ isPublic: false });
    if (isUpdate) updateNovelMutation.mutate(fd);
    else createNovelMutation.mutate(fd);
  };

  const handlePublishNow = () => {
    const fd = toFormData({ isPublic: true });
    if (isUpdate) updateNovelMutation.mutate(fd);
    else createNovelMutation.mutate(fd);
  };

  const handleCheckSlug = () => {
    if (!isValidUrl(form.slug)) {
      setUrlError("Slug chỉ gồm chữ thường, số và dấu gạch ngang.");
      setUrlOk("");
      return;
    }
    setUrlError("");
    setUrlOk("");
    checkSlug();
  };

  useEffect(() => {
    if (slugChecked == null) return;
    if (slugChecked.exists) {
      setUrlError("Đã tồn tại URL này!");
      setUrlOk("");
    } else {
      setUrlError("");
      setUrlOk(`URL khả dụng: inkwave.io/novels/${form.slug}`);
    }
  }, [slugChecked, form.slug]);

  useEffect(() => {
    setUrlError("");
    setUrlOk("");
  }, [form.slug]);

  useEffect(() => {
    setForm((p) => ({ ...p, tags: selectedTags }));
  }, [selectedTags]);

  useEffect(() => {
    if (form.novelImage) {
      const url = URL.createObjectURL(form.novelImage);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setImagePreview(null);
  }, [form.novelImage]);

  useEffect(() => {
    if (form.novelBanner) {
      const url = URL.createObjectURL(form.novelBanner);
      setBannerPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setBannerPreview(null);
  }, [form.novelBanner]);

  useEffect(() => {
    if (isSuccess && novelData) {
      const n = novelData.data.data.novelInfo;
      const tags = (n.tags || []).map((t: any) => t.tagId);
      const loadFiles = async () => {
        const img = n.novelImage ? await urlToFile(n.novelImage, "novel-image.jpg") : null;
        const ban = n.novelBanner ? await urlToFile(n.novelBanner, "banner.jpg") : null;
        setForm({
          title: n.title,
          description: n.description,
          slug: n.slug,
          authorId: n.authorId,
          novelImage: img,
          novelBanner: ban,
          tags,
          status: n.status,
          isPublic: n.isPublic,
          isPaid: n.isPaid,
          isLock: n.isLock,
          allowComment: n.allowComment,
          price: n.price,
        });
        setSelectedTags(tags);
        if (img) setImagePreview(URL.createObjectURL(img));
        if (ban) setBannerPreview(URL.createObjectURL(ban));
        setSlugTouched(true);
        setLastAutoSlug(slugifyVi(n.title || ""));
      };
      loadFiles();
    }
  }, [isSuccess, novelData]);

  const busy = createNovelMutation.isPending || updateNovelMutation.isPending;

  const onTitleChange = (val: string) => {
    const auto = slugifyVi(val);
    setForm((prev) => {
      const shouldAuto = !slugTouched || prev.slug === lastAutoSlug || !prev.slug;
      const nextSlug = shouldAuto ? auto : prev.slug;
      if (shouldAuto) setLastAutoSlug(auto);
      return { ...prev, title: val, slug: nextSlug };
    });
  };

  const onSlugChange = (val: string) => {
    setSlugTouched(true);
    const clean = slugifyVi(val);
    setForm((p) => ({ ...p, slug: clean }));
  };

  const previewTitle = form.title || "Tên truyện";
  const previewDesc = form.description?.trim() ? form.description.trim() : "Mô tả ngắn gọn hiển thị ở đây.";
  const previewSlug = form.slug || "ten-truyen";

  return (
    <section className="min-h-screen bg-[#0b0d11] text-white">
      <div className="max-w-[71rem] mx-auto px-4 md:px-6 py-8">
        <header className="mb-6">
          <h1 className="text-[20px] md:text-[22px] font-semibold tracking-tight">{isUpdate ? "Chỉnh sửa truyện" : "Tạo truyện mới"}</h1>
          <p className="text-white/80 text-[13px] mt-1">Viết chill — xuất bản liền tay.</p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <main className="col-span-12 md:col-span-8 space-y-6">
            <div className="rounded-lg bg-[#0e1117]/92 ring-1 ring-white/8 backdrop-blur-sm shadow-[0_22px_60px_-30px_rgba(0,0,0,0.6)] p-5 md:p-6">
              <div className="mb-5">
                <label className="block text-[13px] mb-1.5 font-semibold">
                  Tên truyện <span className="text-red-500 font-semibold">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Nhập tên truyện"
                  className="w-full rounded-md bg-[#0b0e13] ring-1 ring-white/10 px-3 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#ff8a5c]/35"
                />
                <div className="mt-1 text-right text-xs text-white/50">{form.title.length}/100</div>
              </div>

              <div className="mb-5">
                <label className="block text-[13px] mb-1.5 font-semibold">Đường dẫn</label>
                <div className="flex items-stretch rounded-md overflow-hidden ring-1 ring-white/10 bg-[#0b0e13]">
                  <span className="hidden sm:flex items-center px-3 text-white/70 text-[13px] bg-white/[0.04] ring-1 ring-inset ring-white/10">
                    inkwave.io/novels/
                  </span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent px-3 py-2.5 text-[14px] placeholder-white/40 outline-none"
                    placeholder="ten-truyen"
                    value={form.slug}
                    onChange={(e) => onSlugChange(e.target.value)}
                    maxLength={SLUG_MAX}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <button
                    onClick={handleCheckSlug}
                    disabled={isChecking || !form.slug.trim()}
                    className="px-3 sm:px-4 text-[13px] font-medium bg-white/[0.06] hover:bg-white/[0.12] transition disabled:opacity-60"
                  >
                    {isChecking ? "Đang kiểm..." : "Kiểm tra"}
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p
                    className={[
                      "text-[12px] inline-flex items-center gap-1.5",
                      urlError ? "text-red-400" : urlOk ? "text-emerald-400" : "text-white/55",
                    ].join(" ")}
                  >
                    {urlOk && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                    {urlError || urlOk || ""}
                  </p>
                  <p className="text-[12px] text-white/55">
                    {form.slug.length}/{SLUG_MAX}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-[13px] mb-1.5 font-semibold">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Viết tóm tắt 1–3 đoạn, nêu bật điểm khác biệt."
                  className="w-full rounded-md bg-[#0b0e13] ring-1 ring-white/10 px-3 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#ff8a5c]/35 resize-none"
                />
                <div className="mt-1 text-right text-xs text-white/50">{form.description.length}/1000</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] mb-2 font-semibold">
                    Bìa truyện <span className="text-red-500 font-semibold">*</span>
                  </label>
                  <label className="relative inline-flex items-center justify-center w-[180px] h-[250px] rounded-md bg-[#0b0e13] ring-1 ring-white/10 hover:bg-white/[0.06] transition cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setForm((p) => ({ ...p, novelImage: f }));
                      }}
                    />
                    {imagePreview ? (
                      <img src={imagePreview} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <span className="text-[13px] text-white/65">+ Tải ảnh bìa</span>
                    )}
                  </label>
                  <p className="mt-2 text-[12px] text-white/55">3:4 • JPG/PNG • &lt; 5MB</p>
                </div>

                <div>
                  <label className="block text-[13px] mb-2 font-semibold">Banner (tuỳ chọn)</label>
                  <label className="relative inline-flex items-center justify-center w-full max-w-[340px] h-[110px] rounded-md bg-[#0b0e13] ring-1 ring-white/10 hover:bg-white/[0.06] transition cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setForm((p) => ({ ...p, novelBanner: f }));
                      }}
                    />
                    {bannerPreview ? (
                      <img src={bannerPreview} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <span className="text-[13px] text-white/65">+ Tải banner</span>
                    )}
                  </label>
                  <p className="mt-2 text-[12px] text-white/55">16:5 • JPG/PNG</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[13px] font-semibold">Chủ đề</label>
                  <span className="text-[12px] text-white/60">{selectedTags.length}/3</span>
                </div>
                <input
                  value={tagQuery}
                  onChange={(e) => setTagQuery(e.target.value)}
                  placeholder="Tìm thẻ..."
                  className="w-full mb-3 rounded-md bg-[#0b0e13] ring-1 ring-white/10 px-3 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-[#ff8a5c]/35"
                />
                <div className="flex flex-wrap gap-2">
                  {filteredTags?.map((tag: any) => {
                    const active = selectedTags.includes(tag.tagId);
                    const disabled = !active && selectedTags.length >= 3;
                    return (
                      <button
                        key={tag.tagId}
                        type="button"
                        onClick={() => toggleTag(tag.tagId)}
                        disabled={disabled}
                        className={[
                          "px-3 py-1.5 rounded-full text-[13px] ring-1 transition",
                          active
                            ? "ring-transparent bg-[linear-gradient(90deg,#ff512f,0%,#ff6740,55%,#ff9966)] text-white shadow-[0_10px_26px_-14px_rgba(255,102,64,0.55)]"
                            : "ring-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                          disabled ? "opacity-40 cursor-not-allowed" : "",
                        ].join(" ")}
                        title={active ? "Bỏ chọn" : disabled ? "Tối đa 3 thẻ" : "Chọn"}
                      >
                        {tag.name || tag.slug || "Tag"}
                      </button>
                    );
                  })}
                  {filteredTags?.length === 0 && <span className="text-[13px] text-white/50">Không có thẻ phù hợp.</span>}
                </div>
              </div>
            </div>
          </main>

          <aside className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-4 max-h-[calc(100vh-2rem)] overflow-auto space-y-4">
              <ActionsBar busy={busy} onCancel={() => navigate(-1)} onSaveDraft={handleSaveDraft} onPublish={handlePublishNow} />
              <PreviewCard title={previewTitle} description={previewDesc} slug={previewSlug} imagePreview={imagePreview} bannerPreview={bannerPreview} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
