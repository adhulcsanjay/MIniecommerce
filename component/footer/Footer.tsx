import Image from "next/image";

export default function BrandHeader() {
  return (
    <footer className="w-full bg-black px-6 py-32 sm:px-10 md:px-20 lg:px-32">
      
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-8 sm:gap-0">

        {/* LEFT (Logo) */}
        <div className="flex justify-center sm:justify-start">
          <Image src="/Vector.png" alt="logo" width={120} height={120}/>
        </div>

        {/* CENTER (Optional Middle Content) */}
        <div className="flex justify-center">
          {/* You can add tagline or keep empty */}
        </div>

        {/* RIGHT (Social Icons) */}
        <div className="flex justify-center sm:justify-end items-center gap-6">
          <Image src="/gg_facebook.png" alt="facebook" width={30} height={30}/>
          <Image src="/Vector (1).png" alt="instagram" width={25} height={25}/>
          <Image src="/Clip path group.png" alt="twitter" width={25} height={25}/>
        </div>

      </div>

    </footer>
  );
}
