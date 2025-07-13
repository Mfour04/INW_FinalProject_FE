export const LoginNeeded = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#1c1c1f] text-white px-4">
      <div className="bg-[#2a2a2e] px-8 py-6 rounded-xl shadow-lg text-center max-w-md w-full">
        <h2 className="text-xl font-semibold mb-3">🔒 Truy cập bị từ chối</h2>
        <p className="text-sm opacity-80">
          Bạn cần <span className="font-medium text-[#ff6740]">đăng nhập</span>{" "}
          để truy cập vào trang này.
        </p>
      </div>
    </div>
  );
};
