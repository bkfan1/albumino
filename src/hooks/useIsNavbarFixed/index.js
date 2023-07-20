import { useEffect, useState } from "react";

export const useIsNavbarFixed = () => {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarFixed(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    isNavbarFixed,
    setIsNavbarFixed,
  };
};
