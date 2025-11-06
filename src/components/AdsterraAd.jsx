"use client";
import { useEffect, useRef } from "react";

export default function AdBanner({
  keyId,
  width = 160,
  height = 300,
  format = "iframe",
  className = "",
}) {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");

      conf.innerHTML = `atOptions = ${JSON.stringify({
        key: keyId,
        format,
        height,
        width,
        params: {},
      })};`;

      script.type = "text/javascript";
      script.async = true;
      script.src = `//www.highperformanceformat.com/${keyId}/invoke.js`;

      bannerRef.current.appendChild(conf);
      bannerRef.current.appendChild(script);
    }
  }, [keyId, width, height, format]);

  return (
    <div
      ref={bannerRef}
      className={`mx-auto flex justify-center items-center  ${className}`}
      //   style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}

// import { useEffect, useRef } from 'react'
// export default function Banner(): JSX.Element {
//     const banner = useRef<HTMLDivElement>()

//     const atOptions = {
//         key: 'KEY_HERE',
//         format: 'iframe',
//         height: 50,
//         width: 320,
//         params: {},
//     }
//     useEffect(() => {
//     if (banner.current && !banner.current.firstChild) {
//         const conf = document.createElement('script')
//         const script = document.createElement('script')
//         script.type = 'text/javascript'
//         script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`
//         conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

//         banner.current.append(conf)
//         banner.current.append(script)
//     }
// }, [banner])

//     return <div className="mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center" ref={banner}></div>
// }
