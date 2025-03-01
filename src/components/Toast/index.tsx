import React, { useEffect } from "react";
import "./styles.css";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="toast">
      {message}
    </div>
  );
};

export default Toast;
