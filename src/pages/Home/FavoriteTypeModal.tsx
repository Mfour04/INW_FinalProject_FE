import { useState } from "react";
import type { Tag } from "../../entity/tag";
import { TagView } from "../../components/TagComponent";
import Button from "../../components/ButtonComponent";

type Props = {
  allTypes: Tag[];
  selected: Tag[];
  onClose: () => void;
  onConfirm: (selectedTypes: Tag[]) => void;
  isLoading: boolean;
};

export const FavouriteTypeModal = ({
  allTypes,
  selected,
  onClose,
  onConfirm,
  isLoading,
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
      <div className="bg-[#1e1e21] rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl text-white font-bold mb-4">
          Chọn thể loại yêu thích
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {allTypes?.map((tag) => {
            const isSelected = selectedTypes.some((t) => t.tagId === tag.tagId);
            return (
              <TagView
                key={tag.tagId}
                tag={tag}
                onClick={() => toggleType(tag)}
                className={`cursor-pointer ${
                  isSelected && "bg-[#ff6740] text-white hover:bg-orange-600"
                }`}
              />
              // <button
              //   key={tag.tagId}
              //   className={`px-3 py-1 rounded border ${
              //     isSelected
              //       ? "bg-blue-500 text-white border-blue-500"
              //       : "bg-gray-100 text-gray-700 border-gray-300"
              //   }`}
              //   onClick={() => toggleType(tag)}
              // >
              //   {tag.name}
              // </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-[#ff6740] hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Chọn sau
          </button>
          <Button
            onClick={() => onConfirm(selectedTypes)}
            isLoading={isLoading}
            className="bg-[#ff6740] hover:bg-orange-600 text-white px-4 py-2 rounded border-none"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};
