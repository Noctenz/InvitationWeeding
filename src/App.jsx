import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EnvelopeOpening from "./EnvelopeOpening";
import WeddingInvite from "./WeddingInvite";

export default function App() {
  const [openDone, setOpenDone] = useState(false);

  const handleOpenDone = () => {
    setOpenDone(true);

    // Play music AFTER envelope opening
    setTimeout(() => {
      const audio = document.getElementById("weddingMusic");
      if (audio) {
        audio.volume = 1.0;
        audio.play().catch(() => {});
      }
    }, 300);
  };

  return (
    <AnimatePresence mode="wait">
      {!openDone ? (
        <motion.div
          key="envelope"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
        >
          <EnvelopeOpening onDone={handleOpenDone} />
        </motion.div>
      ) : (
        <motion.div
          key="wedding"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
          exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
        >
          <WeddingInvite
            couple={{ bride: "Nama Wanita", groom: "Nama Pria" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
