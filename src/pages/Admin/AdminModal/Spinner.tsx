import { motion } from "framer-motion";

const Spinner = () => (
  <motion.div
    className="flex justify-center items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="w-8 h-8 border-4 border-t-[#ff4d4f] dark:border-t-[#ff6740] border-gray-200 dark:border-gray-700 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

export default Spinner;
