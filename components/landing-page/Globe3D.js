// INFORMATION
// The code in this file is super hacky. If you find a better way
// for getting a spinning globe, feel free to implement it
import { useRef, useEffect, useState } from "react";

let Globe = () => null;
// eslint-disable-next-line @typescript-eslint/no-var-requires
if (typeof window !== "undefined") Globe = require("react-globe.gl").default;

export default function Globe3D() {
  const globeRef = useRef(null);
  const [tabFocussed, setTabFocussed] = useState(true);

  const arcsData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: [["#666"][0], ["#888"][0]],
  }));

  function setGlobeControls() {
    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 1;
    globeRef.current.controls().enableZoom = false;
  }

  function onTabFocusChange() {
    if (document.hidden) {
      setTabFocussed(false);
    } else {
      setTabFocussed(true);
      setGlobeControls();
    }
  }

  useEffect(() => {
    onTabFocusChange();

    document.addEventListener("visibilitychange", onTabFocusChange);

    return function cleanup() {
      document.removeEventListener("visibilitychange", onTabFocusChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ marginLeft: "-35px" }} suppressHydrationWarning={true}>
      {tabFocussed && (
        <Globe
          ref={globeRef}
          width={200}
          height={200}
          backgroundColor={"rgba(0,0,0,0)"}
          globeImageUrl="/earth.jpg"
          arcColor={"color"}
          arcsData={arcsData}
          arcDashGap={0.6}
          arcDashLength={0.3}
          arcDashAnimateTime={4000 + 500}
          rendererConfig={{ preserveDrawingBuffer: true }}
        />
      )}
    </div>
  );
}
