import { useState } from "react";
import type { Tag } from "../../entity/tag";

type Props = {
  allTypes: Tag[];
  selected: Tag[];
  onClose: () => void;
  onConfirm: (selectedTypes: Tag[]) => void;
};

export const FavouriteTypeModal = ({
  allTypes,
  selected,
  onClose,
  onConfirm,
}: Props) => {
  const [selectedTypes, setSelectedTypes] = useState<Tag[]>(selected);

  const toggleType = (tag: Tag) => {
    setSelectedTypes((prev) =>
      prev.find((t) => t.tagId === tag.tagId)
        ? prev.filter((t) => t.tagId !== tag.tagId)
        : [...prev, tag]
    );
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Chọn thể loại yêu thích</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {allTypes?.map((tag) => {
            const isSelected = selectedTypes.some((t) => t.tagId === tag.tagId);
            return (
              <button
                key={tag.tagId}
                className={`px-3 py-1 rounded border ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
                onClick={() => toggleType(tag)}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Chọn sau
          </button>
          <button
            onClick={() => onConfirm(selectedTypes)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
