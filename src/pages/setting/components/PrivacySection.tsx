import { SectionCard } from "../components/SectionCard";

export const PrivacySection = () => {
  return (
    <SectionCard title="Quyền riêng tư" desc="Quản lý danh sách chặn.">
      <div className="space-y-4">
        <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
          Bỏ chặn người dùng đã chọn.
        </p>
        <label className="inline-flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
          <input type="checkbox" className="accent-[#ff6740]" />
          Chọn tất cả
        </label>
      </div>
    </SectionCard>
  );
};
