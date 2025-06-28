import Image from "next/image";

export interface IconProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

export function Icon({
  src,
  alt,
  size = 24,
  className = "",
  priority = false,
}: IconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className="object-contain filter brightness-0 invert"
        style={{
          width: size,
          height: size,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </div>
  );
}
