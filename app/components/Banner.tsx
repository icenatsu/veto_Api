import { Button } from "@/components/ui/button";
import Link from "next/link";

const Banner = () => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/1.jpg)", height: "100vh" }}
    >
      <div className="mt-2 w-full rounded-md bg-black/10 py-2 md:py-14">
        <h2 className="mt-4 whitespace-pre-line text-center text-xl leading-relaxed text-white md:text-2xl lg:text-6xl">{`Découvrez des \n vétérinaires à proximité de chez \n vous`}</h2>
        <p className="mt-4 whitespace-pre-line text-center text-sm text-white md:text-xl lg:text-2xl">{`Les soins de votre animal commencent ici.`}</p>
      </div>
      <Link href="/veterinaries">
        <Button
          variant={"destructive"}
          className="mt-8 py-6 text-sm md:text-xl"
        >
          Commencer
        </Button>
      </Link>
    </div>
  );
};

export default Banner;
