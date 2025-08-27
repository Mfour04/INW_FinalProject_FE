import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SummarizeNovels } from "../../api/AI/ai.api";
import { GetNovelByUrl } from "../../api/Novels/novel.api";

type ChatMessage = {
  sender: "user" | "ai";
  content: string;
};

export const SummarizeNovel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      content:
        "Xin chào, hãy nhập url của truyện (truyen-vui trong inkwave.io/novels/truyen-vui) để tôi giúp bạn tóm tắt nhé!",
    },
  ]);

  const { refetch } = useQuery({
    queryKey: ["novel-by-slug", input],
    queryFn: async () => {
      try {
        const res = await GetNovelByUrl(input!);
        return res.data.data;
      } catch {
        return null;
      }
    },
    enabled: false,
  });

  const mutation = useMutation({
    mutationFn: (novelId: string) => SummarizeNovels({ novelId }),
    onSuccess: (res) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content: res.data.data || "Không tìm thấy tiểu thuyết",
        },
      ]);
      setInput("");
    },
    onError: (err: any) => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "Có lỗi xảy ra: " + err.message },
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", content: input }]);
    refetch().then((res) => mutation.mutate(res.data?.novelInfo.novelId!));
    // mutation.mutate(input.trim());
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        Tóm tắt
      </button>

      {/* Chat box */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 max-h-[400px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg flex flex-col z-50">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Tóm tắt
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {mutation.isPending && (
              <div className="text-left">
                <div className="inline-block px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white animate-pulse">
                  AI đang suy nghĩ...
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              placeholder="Nhập Novel ID..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={mutation.isPending}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
              disabled={mutation.isPending || !input.trim()}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
