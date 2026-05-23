import React from "react";

interface ModalProps {
    children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
    return (
        <div className="flex items-start justify-center w-full h-full pt-8 pb-8">
            <div className="bg-white rounded-2xl shadow-2xl w-[440px] max-h-full overflow-y-auto p-8">
                {children}
            </div>
        </div>
    );
};

export default Modal;
