import React, { useState } from "react";

type DocImageProps = {
  src: string;
  caption?: string;
  className?: string;
};
const imgClass = "w-full my-4 rounded-lg border border-gray-700 max-w-md shadow-md";
const DocImage: React.FC<DocImageProps> = ({ src, caption, className = imgClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="my-4 cursor-pointer" onClick={() => setIsOpen(true)}>
        <img src={src} className={className} />
        {caption && <p className="text-sm text-center text-gray-400 mt-1">{caption}</p>}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setIsOpen(false)}
        >
          <img src={src} className="max-w-full max-h-full rounded-lg shadow-xl" />
        </div>
      )}
    </>
  );
};

export default DocImage;
