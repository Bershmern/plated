
export interface ZPatternBlock {
  title: string;
  description: string;
  imageComponent?: React.ReactNode;
}

export interface FeatureZPatternProps {
  headline: string;
  blocks: ZPatternBlock[];
}

export function FeatureZPattern({ headline, blocks }: FeatureZPatternProps) {
  return (
    <section className="w-full bg-surface-secondary py-32 flex flex-col items-center px-4 sm:px-6 relative z-10 border-t border-border-default">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-24 px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-text-primary leading-[1.15] text-balance">
          {headline}
        </h2>
      </div>

      {/* BLOCKS */}
      <div className="w-full max-w-[1200px] flex flex-col gap-24 lg:gap-32">
        {blocks.map((block, idx) => {
          const isImageRight = idx % 2 === 0;
          
          return (
            <div 
              key={idx} 
              className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              {/* Image/Graphic Box */}
              <div 
                className={`w-full aspect-[4/3] rounded-3xl overflow-hidden bg-surface-primary border border-border-default shadow-xl flex items-center justify-center relative ${
                  isImageRight ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-secondary to-transparent" />
                {block.imageComponent ? (
                  block.imageComponent
                ) : (
                  <div className="relative z-10 text-text-tertiary font-bold uppercase tracking-widest text-center px-6">
                    Graphic {idx + 1}
                  </div>
                )}
              </div>

              {/* Text Box */}
              <div 
                className={`flex flex-col gap-6 ${
                  isImageRight ? "lg:order-1" : "lg:order-2 lg:pl-8"
                }`}
              >
                <h3 className="text-3xl sm:text-[36px] font-extrabold tracking-tight text-text-primary leading-[1.15] text-balance">
                  {block.title}
                </h3>
                <p className="text-[17px] text-text-secondary leading-relaxed font-medium">
                  {block.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
