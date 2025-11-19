import { useState } from "react";
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
    <>
      {!openDone && <EnvelopeOpening onDone={handleOpenDone} />}

      {openDone && (
        <WeddingInvite
          couple={{ bride: "Nama Wanita", groom: "Nama Pria" }}
        />
      )}
    </>
  );
}
