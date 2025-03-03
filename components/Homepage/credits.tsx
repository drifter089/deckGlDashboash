import Image from "next/image";
import Link from "next/link";

export const CreditsSection = () => {
  return (
    <section className="container py-16">
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-4 text-card-foreground">
        Credits
      </h2>
      
      <p className="max-w-screen-sm mx-auto text-lg text-muted-foreground text-center mb-12">
        This project was financed by the program{" "}
        <Link href="https://www.junge-innovatoren.de/" target="_blank" className="text-[#E31937] hover:text-[#E31937]/80 transition-colors font-medium">
          "Junge Innovatoren (JI)"
        </Link>{" "}
        of the Federal State of Baden-Württemberg and developed in collaboration with the{" "}
        <Link href="https://kit.edu/" target="_blank" className="text-[#E31937] hover:text-[#E31937]/80 transition-colors font-medium">
          Karlsruhe Institute of Technology (KIT)
        </Link>
        ,{" "}
        <Link href="https://openenergytransition.org/" target="_blank" className="text-[#E31937] hover:text-[#E31937]/80 transition-colors font-medium">
          Open Energy Transition (OET)
        </Link>
        .
      </p>

      <div className="flex justify-center items-center gap-8 flex-wrap">
        <Link href="https://www.junge-innovatoren.de/" target="_blank" className="transition-transform hover:scale-105">
          <Image
            src="/images/credits/JI logo I.png"
            alt="Junge Innovatoren"
            width={200}
            height={100}
            className="h-[100px] w-auto object-contain"
          />
        </Link>
        <Link href="https://www.baden-wuerttemberg.de/de/startseite/" target="_blank" className="transition-transform hover:scale-105">
          <Image
            src="/images/credits/BW logo.png"
            alt="Baden-Württemberg"
            width={200}
            height={100}
            className="h-[100px] w-auto object-contain"
          />
        </Link>
        <Link href="https://www.kit.edu/" target="_blank" className="transition-transform hover:scale-105">
          <Image
            src="/images/credits/KIT logo.png"
            alt="KIT"
            width={200}
            height={100}
            className="h-[100px] w-auto object-contain"
          />
        </Link>
        <Link href="https://openenergytransition.org/" target="_blank" className="transition-transform hover:scale-105">
          <Image
            src="/images/credits/OET logo.png"
            alt="OET"
            width={200}
            height={100}
            className="h-[100px] w-auto object-contain"
          />
        </Link>
      </div>
    </section>
  );
}; 