import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnvelopeOpening({ onDone }) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    setOpened(true);

    const audio = document.getElementById("weddingMusic");
    if (audio) {
      audio.volume = 1;
      audio.currentTime = 0;
      audio.play().catch(() => {
        console.log("Autoplay diblokir, memerlukan interaksi tambahan.");
      });
    }

    // Delay sedikit supaya animasi keluar kelihatan
    setTimeout(() => onDone(), 600);
  }

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          key="envelope"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-4"
          style={{ backgroundImage: "url('./foto.jpg')" }}
        >
          <div className="bg-black bg-opacity-30 w-full h-full absolute inset-0"></div>
          <div className="relative z-10 text-center text-white max-w-full p-6">
            <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl font-poppins font-bold mb-2 w-full text-center">
              Wedding Invitation
            </h1>
            <p className="text-sm font-poppins font-normal mb-4">We invited you to celebrate our wedding</p>
            <h2 className="text-8xl font-luxurious italic leading-[0.8]">Leonita</h2>
            <h2 className="text-8xl font-luxurious italic leading-[0.8]">&</h2>
            <h2 className="text-8xl font-luxurious italic leading-[0.8]">Ridho</h2>
            <p className="text-sm font-poppins font-normal mb-7">Saturday, 27 December 2025</p>

            <button
              onClick={handleOpen}
              className="relative px-8 py-3 mb-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white font-semibold hover:bg-white/30 transition duration-300"
            >
              Open
            </button>
            <div className="text-sm font-poppins font-normal">
            © 2025 Sovereign Studio. All rights reserved – Made by @mhmdshandiakbar
            </div>
          </div>

          <audio
            id="weddingMusic"
            src="/music.mp3"
            preload="auto"
            playsInline
            controls={false}
            style={{ display: "none" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
