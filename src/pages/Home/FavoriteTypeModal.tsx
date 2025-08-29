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
        <div className="flex flex-wrap gap-3 mb-3">
          {allTypes?.map((tag) => {
            const isSelected = selectedTypes.some((t) => t.tagId === tag.tagId);
            return (
              <TagView
                key={tag.tagId}
                tag={tag}
                onClick={() => toggleType(tag)}
                className={`cursor-pointer bg-[#1e1e21] border-[1px] text-gray-300
                            min-w-fit max-w-full flex-initial text-[14px] ${
                              isSelected &&
                              " text-white font-medium border-[#ff6740]"
                            }`}
              />
            );
          })}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onConfirm(selectedTypes)}
            disabled={selectedTypes.length === 0}
            isLoading={isLoading}
            className="bg-[#ff6740] h-9 hover:bg-orange-600 text-white px-4 py-2 rounded border-none"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};
