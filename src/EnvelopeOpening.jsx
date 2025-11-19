import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnvelopeOpening({ onDone }) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    setOpened(true);

    // Play music safely
    const audio = document.getElementById("weddingMusic");
    if (audio) {
      audio.volume = 1;
      audio.currentTime = 0;

      // browser-safe play
      audio.play().catch(() => {
        console.log("Autoplay diblokir, memerlukan interaksi tambahan.");
      });
    }

    // Delay masuk ke page utama
    setTimeout(() => {
      onDone();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fbe8ef]">
      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="cursor-pointer select-none"
            onClick={handleOpen}
          >
            {/* Envelope Box */}
            <div className="w-64 h-48 relative">
              {/* Back */}
              <div className="absolute inset-0 bg-pink-200 rounded-lg shadow-xl"></div>

              {/* Top Flap */}
              <motion.div
                className="absolute top-0 left-0 w-full h-1/2 bg-pink-300 rounded-t-lg origin-top"
                initial={{ rotateX: 0 }}
                animate={opened ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              ></motion.div>

              {/* Bottom Flap */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-pink-400 rounded-b-lg"></div>
            </div>

            <p className="text-center mt-4 text-gray-700 font-semibold">
              Buka Undangan
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio */}
      <audio
        id="weddingMusic"
        src="/music.mp3"
        preload="auto"
        playsInLine
        controls={false}
        style={{ display: "none" }}
      />
    </div>
  );
}
