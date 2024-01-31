import React, { useEffect, useState } from "react";
import ManualHeader from "components/ManualHeader";
import Header from "components/Header";
import LotteryEntrance from "components/LotteryEntrance";
import WebsiteContainer from "components/WebsiteContainer";

// Browser Detection
const isBrowser = typeof window !== "undefined";

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(Number(isBrowser && window.innerWidth));

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div id="page" className="min-h-[100vh] overflow-hidden relative z-10">
      <div>
        <WebsiteContainer>
          <Header />
        </WebsiteContainer>

        <div className="z-10 relative border-b border-orange-300" />

        <WebsiteContainer>
          {/* <ManualHeader /> */}
          <LotteryEntrance />
          {windowWidth < 1921 && (
            <div className="">
              <div className="animate-pulse-slow z-0 absolute top-[-50px] right-[-700px] xl:right-[-750px] xxl:right-[-900px] w-[100vh] h-[65vh] rounded-[50%] blur-[120px] bg-[#5c3bff]" />
              <div className="animate-pulse-slow z-0 absolute bottom-[-50px] right-[-700px] xl:right-[-750px] xxl:right-[-900px] w-[100vh] h-[65vh] rounded-[50%] blur-[120px] bg-[#5c3bff]" />
            </div>
          )}
        </WebsiteContainer>
      </div>
    </div>
  );
}
