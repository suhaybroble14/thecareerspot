import AnimateIn from "./AnimateIn";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-2xl mb-16 ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {label && (
        <AnimateIn>
          <span
            className={`text-xs tracking-[0.3em] uppercase ${
              light ? "text-camel" : "text-cocoa"
            }`}
          >
            {label}
          </span>
        </AnimateIn>
      )}
      <AnimateIn delay={0.1}>
        <h2
          className={`font-serif text-4xl md:text-5xl mt-4 mb-6 leading-tight ${
            light ? "text-cream" : "text-forest"
          }`}
        >
          {title}
        </h2>
      </AnimateIn>
      {description && (
        <AnimateIn delay={0.2}>
          <p
            className={`text-lg leading-relaxed ${
              light ? "text-cream/70" : "text-forest/70"
            }`}
          >
            {description}
          </p>
        </AnimateIn>
      )}
    </div>
  );
}
