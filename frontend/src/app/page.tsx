import Image from 'next/image';

export default function Home() {
  return (
    // bg-[#004431]
    <div className="min-h-screen flex flex-col justify-between bg-pink-400">
      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8 bg-white/90 rounded-2xl p-6 sm:p-10 shadow-2xl border border-white/30">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Image
              src="/deelfabriek-website-labels-boven_v2.svg"
              alt="Deelfabriek Kortrijk Logo"
              width={250}
              height={100}
              priority
              className="mx-auto w-[200px] sm:w-[250px]"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#004431] mb-3 sm:mb-4 tracking-tight">
            Binnenkort Online
          </h1>

          <p className="text-lg sm:text-xl text-[#1A1A1A] mb-6 sm:mb-8">
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
      <footer className="w-full bg-[#004431] py-6 px-4 sm:px-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full max-w-2xl mx-auto gap-4 sm:gap-8 sm:justify-center">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Image
              src="/logo-stadkortrijk.png"
              alt="Kortrijk Logo"
              width={140}
              height={56}
              className="bg-transparent w-[120px] h-auto mb-2 sm:mb-0 sm:w-[260px] sm:h-[45px]"
            />
          </div>
          <div className="text-white flex flex-col justify-center items-start">
            <span className="font-bold text-lg sm:text-lg">Deelfabriek</span>
            <span className="text-base sm:text-base">
              Rijkswachtstraat 5, 8500 Kortrijk
            </span>
            <span className="text-base sm:text-base mt-2">056 27 76 60</span>
            <span className="text-base sm:text-base">
              deelfabriek@kortrijk.be
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
