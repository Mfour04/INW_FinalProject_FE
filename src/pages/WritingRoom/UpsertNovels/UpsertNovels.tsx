import { useNavigate, useParams } from "react-router-dom";
import ArrowLeft02 from "../../../assets/svg/WritingRoom/arrow-left-02-stroke-rounded.svg";
import Button from "../../../components/ButtonComponent";
import type { CreateNovelRequest } from "../../../api/Novels/novel.type";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateNovels,
  GetNovelByUrl,
  GetUrlChecked,
  UpdateNovels,
} from "../../../api/Novels/novel.api";
import { useAuth } from "../../../hooks/useAuth";
import { getTags } from "../../../api/Tags/tag.api";
import { useToast } from "../../../context/ToastContext/toast-context";
import { urlToFile } from "../../../utils/img";
import { TagView } from "../../../components/TagComponent";
import { isValidUrl } from "../../../utils/validation";

const initialCreateNovelForms: CreateNovelRequest = {
  title: "",
  slug: "",
  description: "",
  authorId: "",
  novelImage: null,
  novelBanner: null,
  tags: [],
  status: 0,
  isPublic: true,
  isPaid: false,
  isLock: false,
  allowComment: true,
  price: 0,
};

export const UpsertNovels = () => {
  const [createNovelForm, setCreateNovelForm] = useState<CreateNovelRequest>(
    initialCreateNovelForms
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string>("");

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

  console.log(novelData);

  const {
    data: slugChecked,
    refetch: checkSlug,
    isFetching: isChecking,
  } = useQuery({
    queryKey: ["check-slug", createNovelForm.slug],
    queryFn: () =>
      GetUrlChecked(createNovelForm.slug).then((res) => res.data.data),
    enabled: false,
  });

  const createNovelMutation = useMutation({
    mutationFn: (formData: FormData) => CreateNovels(formData),
    onSuccess: () => {
      toast?.onOpen("Bạn đã tạo truyện thành công");
      navigate("/novels/writing-room");
    },
    onError: () => {
      toast?.onOpen("Có lỗi xảy ra trong lúc tạo truyện");
    },
  });

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const updateNovelMutation = useMutation({
    mutationFn: (formData: FormData) => UpdateNovels(formData),
    onSuccess: () => {
      toast?.onOpen("Cập nhật thành công");
      navigate("/novels/writing-room");
    },
    onError: () => {
      toast?.onOpen("Có lỗi xảy ra trong lúc cập nhật truyện");
    },
  });

  const { data: tagData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags().then((res) => res.data.data),
  });

  const handleCheckSlug = () => {
    if (!isValidUrl(createNovelForm.slug)) {
      setUrlError(
        "Slug không hợp lệ. Chỉ dùng chữ thường, số, và dấu gạch ngang."
      );
      return;
    }
    checkSlug();
  };

  const handleUpsertNovelClick = () => {
    const formData = new FormData();
    formData.append("title", createNovelForm.title);
    formData.append("description", createNovelForm.description);
    formData.append("slug", createNovelForm.slug);

    if (auth?.user?.userId) {
      formData.append("authorId", auth.user.userId);
    }

    if (createNovelForm.novelImage) {
      formData.append("novelImage", createNovelForm.novelImage);
    }

    if (createNovelForm.novelBanner) {
      formData.append("novelBanner", createNovelForm.novelBanner);
    }

    createNovelForm.tags.forEach((tag) => formData.append("tags", tag));

    formData.append("status", createNovelForm.status.toString());
    formData.append("isPublic", createNovelForm.isPublic.toString());
    formData.append("isPaid", createNovelForm.isPaid.toString());
    formData.append("isLock", createNovelForm.isLock.toString());
    formData.append("price", createNovelForm.price.toString());

    if (isUpdate && id) {
      formData.append("novelId", id);
      updateNovelMutation.mutate(formData);
    } else createNovelMutation.mutate(formData);
  };

  useEffect(() => {
    if (slugChecked?.exists) setUrlError("Đã tồn lại Url này!");
    else setUrlError("");
  }, [slugChecked]);

  useEffect(() => {
    setCreateNovelForm((prev) => ({
      ...prev,
      tags: selectedTags,
    }));
  }, [selectedTags]);

  useEffect(() => {
    if (createNovelForm.novelImage) {
      const url = URL.createObjectURL(createNovelForm.novelImage);
      setImagePreview(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [createNovelForm.novelImage]);

  useEffect(() => {
    if (createNovelForm.novelBanner) {
      const url = URL.createObjectURL(createNovelForm.novelBanner);
      setBannerPreview(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setBannerPreview(null);
    }
  }, [createNovelForm.novelBanner]);

  useEffect(() => {
    if (isSuccess && novelData) {
      const novel = novelData.data.data.novelInfo;
      console.log(novel);
      const tags = novel.tags.map((tag) => tag.tagId);

      const fetchFile = async () => {
        let file: File | null = null;
        let banner: File | null = null;
        if (novel.novelImage) {
          file = await urlToFile(novel.novelImage, "novel-image.jpg");
        }
        if (novel.novelBanner) {
          banner = await urlToFile(novel.novelBanner, "banner.jpg");
        }
        setCreateNovelForm({
          title: novel.title,
          description: novel.description,
          slug: novel.slug,
          authorId: novel.authorId,
          novelImage: file,
          novelBanner: banner,
          tags: tags,
          status: novel.status,
          isPublic: novel.isPublic,
          isPaid: novel.isPaid,
          isLock: novel.isLock,
          allowComment: novel.allowComment,
          price: novel.price,
        });
        let objectUrl: string | null = null;

        if (file) {
          objectUrl = URL.createObjectURL(file);
        }
        setImagePreview(objectUrl);
      };

      setSelectedTags(tags);

      fetchFile();
    }
  }, [isSuccess, novelData]);
  return (
    <div className="min-h-screen bg-[#1e1e21] text-white px-6 py-8 rounded-[10px] mx-[50px]">
      <div className="relative flex items-center justify-center mb-8 h-[40px]">
        <button onClick={() => navigate(-1)} className="absolute left-0">
          <img src={ArrowLeft02} />
        </button>
        <h1 className="text-xl font-semibold text-center w-full">
          Tạo truyện mới
        </h1>
      </div>

      <div className="mb-4">
        <label className="block text-xl mb-1">
          Tên truyện <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={createNovelForm.title}
          onChange={(e) =>
            setCreateNovelForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="w-full bg-[#1e1e21] border border-gray-600 rounded px-3 py-2 text-sm"
          placeholder="Nhập tên truyện"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {createNovelForm.title.length}/100
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-xl mb-1">URL</label>
        <div className="flex items-center bg-[#1e1e21] border border-gray-600 rounded overflow-hidden h-10">
          <span className="h-full flex items-center px-3 text-gray-500 text-sm bg-[#2a2a2d]">
            🔗 https://Inkwave.io/Novels/
          </span>
          <input
            type="text"
            className="flex-1 bg-transparent px-2 py-2 text-sm text-white"
            placeholder="ten-truyen"
            value={createNovelForm.slug}
            onChange={(e) =>
              setCreateNovelForm((prev) => ({
                ...prev,
                slug: e.target.value,
              }))
            }
          />
          <button
            onClick={handleCheckSlug}
            disabled={isChecking || !createNovelForm.slug.trim()}
            className="h-full px-4 bg-[#ff6740] text-white text-sm hover:bg-orange-600 disabled:opacity-50"
          >
            {isChecking ? "Đang kiểm tra..." : "Kiểm tra"}
          </button>
        </div>

        <div className="flex justify-between mt-1">
          <p
            className={`text-xs ${urlError ? `text-red-700` : `text-gray-400`}`}
          >
            {urlError ?? urlError}
          </p>
          <p className="text-xs text-gray-400">
            {createNovelForm.slug.length}/30
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-1">
          Mô tả <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={createNovelForm.description}
          onChange={(e) =>
            setCreateNovelForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="w-full bg-[#1e1e21] border border-gray-600 rounded px-3 py-2 text-sm resize-none"
          placeholder="Nhập mô tả truyện..."
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {createNovelForm.description.length}/1000
        </p>
      </div>

      <div className="grid grid-cols-10 gap-6 mb-6">
        <div className="col-span-3">
          <label className="block text-xl mb-1">
            Bìa truyện <span className="text-red-500">*</span>
          </label>
          <label className="border border-dashed border-gray-600 rounded-[8px] flex items-center justify-center h-[200px] w-[150px] cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCreateNovelForm((prev) => ({
                    ...prev,
                    novelImage: file,
                  }));
                }
              }}
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Bìa truyện"
                className="h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">+ Thêm bìa</span>
            )}
          </label>
        </div>

        {/* <div className="col-span-7">
          <label className="block text-xl mb-1">Banner</label>
          <label
            htmlFor="banner-upload"
            className="cursor-pointer border border-dashed border-gray-600 rounded-[8px] flex items-center justify-center h-[200px] text-center px-4 hover:border-blue-400 transition"
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-sm text-gray-400">
                + Thêm bìa
                <br />
                <span className="text-[10px] block mt-1 text-orange-300">
                  Nếu không có ảnh banner truyện, hệ thống sẽ dùng ảnh mặc định.
                </span>
              </span>
            )}
          </label>
          <input
            id="banner-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setCreateNovelForm((prev) => ({
                ...prev,
                banner: file,
              }));

              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setBannerPreview(previewUrl);
              } else {
                setBannerPreview(null);
              }
            }}
          />
        </div> */}
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-2">
          Chủ đề{" "}
          <span className="text-orange-300 text-xs ml-1">⚠️ Tối đa 3 thẻ</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {tagData?.map((tag) => {
            const isSelected = selectedTags.includes(tag.tagId);
            return (
              <button
                key={tag.tagId}
                onClick={() => toggleTag(tag.tagId)}
                // className={`px-3 py-1 rounded-full text-sm border transition
                //                 ${
                //                   isSelected
                //                     ? "bg-[#ff6740] border-blue-400 text-white hover:bg-orange-600"
                //                     : "bg-[#1e1e21] border-gray-600 text-white hover:bg-[#2e2e2e]"
                //                 }`}
              >
                <TagView
                  key={tag.tagId}
                  tag={tag}
                  className={`${
                    isSelected && "bg-[#ff6740] text-white hover:bg-orange-600"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <Button
        isLoading={
          createNovelMutation.isPending || updateNovelMutation.isPending
        }
        onClick={handleUpsertNovelClick}
        className="bg-[#ff6740] hover:bg-[#e14b2e] text-white px-5 py-2 rounded-md text-sm font-semibold"
      >
        {isUpdate ? "Cập nhật" : "Tạo truyện mới"}
      </Button>
    </div>
  );
};
