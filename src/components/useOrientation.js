import { useEffect, useState } from "react";

export default function useOrientation() {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    function onResize() {
      setIsPortrait(window.innerHeight > window.innerWidth);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isPortrait;
}