import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#004431]">
      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-8 bg-white/90 rounded-2xl p-10 shadow-2xl border border-white/30">
          <div className="mb-8 flex justify-center">
            <Image
              src="/deelfabriek-website-labels-boven_v2.svg"
              alt="Deelfabriek Kortrijk Logo"
              width={250}
              height={100}
              priority
              className="mx-auto"
            />
          </div>

          <h1 className="text-4xl font-extrabold text-[#004431] mb-4 tracking-tight">
            Binnenkort Online
          </h1>

          <p className="text-xl text-[#1A1A1A] mb-8">
            We werken hard aan ons nieuw project: The Library of Things voor de
            Deelfabriek Kortrijk. Kom later terug voor meer info!
          </p>

          <div className="flex items-center justify-center space-x-4">
            <div
              className="w-3 h-3 bg-[#FF6B6B] rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-[#4ECDC4] rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-[#FFE66D] rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#004431] py-6 px-8 flex flex-row items-center justify-center gap-12 border-t border-white/10">
        <div className="flex flex-row items-center justify-center w-full max-w-5xl gap-12">
          <Image
            src="/logo-stadkortrijk.png"
            alt="Kortrijk Logo"
            width={160}
            height={160}
            className="bg-transparent"
          />
          <div className="text-white flex flex-col justify-center">
            <span className="font-bold text-lg">Deelfabriek</span>
            <span className="text-base">Rijkswachtstraat 5, 8500 Kortrijk</span>
          </div>
          <div className="text-white flex flex-col justify-center text-left">
            <span className="text-base">056 27 76 60</span>
            <span className="text-base">deelfabriek@kortrijk.be</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
