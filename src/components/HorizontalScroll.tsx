import React, { useRef, useState, useEffect } from "react";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  loop?: boolean;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className = "",
  autoScroll = false,
  autoScrollSpeed = 0.5,
  loop = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Refs for animation loop to avoid dependency triggers
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoScroll || isDragging || isHovered) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();

    const animate = (time: number) => {
      const el = containerRef.current;
      const firstSet = firstSetRef.current;
      
      if (!el || !firstSet) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = time - lastTime;
      lastTime = time;
      const step = (autoScrollSpeed * (delta || 16)) / 16;

      if (loop) {
        // Calculate the width of one single set of items + gap (12px = 0.75rem / gap-3)
        const setWidth = firstSet.offsetWidth + 12;
        if (setWidth > 50) {
          el.scrollLeft += step;
          
          // Seamless infinite circular loop reset!
          if (el.scrollLeft >= setWidth) {
            el.scrollLeft -= setWidth;
          }
        }
      } else {
        // Fallback simple scrolling if loop is disabled
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 5) {
          el.scrollLeft += step;
          if (el.scrollLeft >= maxScroll) el.scrollLeft = 0;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoScroll, autoScrollSpeed, loop, isDragging, isHovered]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    
    if (Math.abs(x - startX) > 5) {
      setHasDragged(true);
    }
    
    let newScroll = scrollLeft - walk;
    
    // Infinite loop wrap-around even when dragging manually!
    if (loop && firstSetRef.current) {
      const setWidth = firstSetRef.current.offsetWidth + 12;
      if (setWidth > 50) {
        if (newScroll >= setWidth) newScroll -= setWidth;
        else if (newScroll < 0) newScroll += setWidth;
      }
    }
    
    containerRef.current.scrollLeft = newScroll;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.stopPropagation();
      e.preventDefault();
      setHasDragged(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClickCapture={handleClickCapture}
      className={`overflow-x-auto no-scrollbar select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
    >
      <div className="flex gap-3 w-max items-center">
        <div ref={firstSetRef} className="shrink-0">
          {children}
        </div>
        {loop && (
          <>
            <div className="shrink-0" aria-hidden="true">
              {children}
            </div>
            <div className="shrink-0" aria-hidden="true">
              {children}
            </div>
            <div className="shrink-0" aria-hidden="true">
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
