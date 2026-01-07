import Image from "next/image";
export default function BrandHeader() {
  return (
    <footer className="w-full bg-black p-32">
      <div className="grid grid-cols-3 items-center">

        {/* LEFT (Logo) */}
        <div className="flex items-center">
          <Image src="/Vector.png" alt="logo" width={120} height={120}/>
          
        </div>

        {/* CENTER (Empty for spacing) */}
        <div className="flex justify-center">
          {/* You can put tagline or keep empty */}
        </div>

        {/* RIGHT (Social Icons) */}
        <div className="flex justify-end items-center gap-10">
           <Image src="/gg_facebook.png" alt="logo" width={30} height={30}/>
           <Image src="/Vector (1).png" alt="logo" width={25} height={25}/>
           <Image src="/Clip path group.png" alt="logo" width={25} height={25}/>
        </div>

      </div>
    </footer>
  );
}
