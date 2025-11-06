import Image from "next/image";
import AnimatedPoster from "@/components/AnimatedPoster";
import React from "react";
export const metadata = {
  title: "Developer with Blogcafeai | Publish Free Games on Blogcafeai",
  description:
    "Publish your free games on Blogcafeai! Share web games, browser games, and no-download fun games online. Reach players looking for new and cool free games",
};
export default function page() {
  return (
    <div className="bg-[#020C17] text-[#abb7c4] -mt-20 max-md:px-4">
      <div className="py-20  px-[20.2rem] media_resp   max-lg:px-5  max-md:px-0">
        <AnimatedPoster className="h-[45vh]" title="DEVELOPERS" />
        {/* <AdsterraAd
          keyId="c0957bab1658f4edf3a744cc4ab8e9f7"
          width={468}
          height={60}
        /> */}
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h1>Developers - Blogcafeai</h1>
        </div>
        <div className="text-[18px]">
          <p className="h-auto">
            Blogcafeai is a top game development studio dedicated to making fun
            and interesting gaming experiences. In addition to creating games,
            we also have expertise in gaming apps and responsive game design,
            which ensures seamless platform integration.
            <br />
            <br />
            Content creators on the Blogcafeai platform have unparalleled control
            over their works. Posting, publishing, tracking, and monetizing
            content is made simple by our user-friendly interface. But what
            really sets us apart are the vibrant community and large number of
            visitors to Blogcafeai.com, which give creators unparalleled
            visibility and audience access.
            <br />
            <br />
            Imagine having the ease to bring your creations to a global
            audience, monetize your labor of love, and increase traffic to your
            games.
            <br />
            <br />
            Developers can make a profitable business out of their passion for
            games with the aid of our platform.
          </p>
        </div>
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h2>Contact Us and Join Now</h2>
          <p className="text-[18px] text-[#abb7c4] font-light mt-2">
            help.Blogcafeai@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
