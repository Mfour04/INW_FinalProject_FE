import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../components/ButtonComponent";

interface ReactPickerProps {
  show: boolean;
  onSelect: (emoji: string) => void;
}

const emojis = ["👍", "❤️", "😂", "😮", "😢", "😣"];

const ReactPicker = ({ show, onSelect }: ReactPickerProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{
            animate: { duration: 0.2, ease: "easeOut" },
            exit: { duration: 0.4, ease: "easeOut" },
          }}
          className="absolute bottom-full mb-[1px] left-0 bg-[#2b2b2c] rounded-full shadow-lg p-2 flex gap-2 z-10 border border-[#444]"
        >
          {emojis.map((emoji) => (
            <motion.div
              key={emoji}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={() => onSelect(emoji)}
                className="text-2xl p-1 hover:bg-[#3a3a3a] bg-[#2b2b2c] rounded-full border-[#2b2b2c] transition-colors duration-200"
              >
                {emoji}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReactPicker;
