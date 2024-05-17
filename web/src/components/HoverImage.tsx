import { useState } from "react";

function HoverImage({
  imageurl,
  children,
}: {
  imageurl: string;
  children: React.ReactNode;
}) {
  const [showImage, setShowImage] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setShowImage(true);
  };

  const handleMouseLeave = () => {
    setShowImage(false);
  };
  
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {showImage && (
        <img
          src={imageurl}
          alt="Hover Image"
          className="absolute w-60 z-50 pointer-events-none"
          style={{
            top: position.y - 100,
            left: position.x - 350,
          }}
        />
      )}
      {children}
    </div>
  );
}

export default HoverImage;
