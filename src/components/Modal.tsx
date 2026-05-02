import { useRef } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  title: string;
  backdropBlur?: boolean;
  className?: string;
}

export default function Modal({
  setModal,
  children,
  title,
  backdropBlur = true,
  className,
}: ModalProps) {
  const shouldCloseOnClickRef = useRef(false);

  const containerClassName =
    "bg-white dark:bg-gray-800 rounded-sm shadow-lg " +
    (className ?? "p-6 min-w-lg min-h-96 max-w-lg w-full");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center z-50 ${
        backdropBlur ? "backdrop-blur-sm" : ""
      }`}
      onMouseDown={(e) => {
        shouldCloseOnClickRef.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        const clickedBackdrop = e.target === e.currentTarget;
        if (clickedBackdrop && shouldCloseOnClickRef.current) {
          setModal(false);
        }
        shouldCloseOnClickRef.current = false;
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div
          className={containerClassName}
          onMouseDown={() => {
            shouldCloseOnClickRef.current = false;
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={() => setModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
