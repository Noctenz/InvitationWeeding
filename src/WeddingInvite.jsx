import React, { useEffect, useState, useRef } from "react";

const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgEIy2Mp6zOeoffuQ_iVizkUKDKphK3rVXOSa6Pt0mdDJNvrOSNZIEP3bICLzH5u4UzPxV2QW-LFvcvXFlG9shrEUnWsy0wdktwCZ-QnUHG5SzjaYUIxcq5u9l4pToCBC75e74r3lxfy2_mjRpIqfvY4mAkWMBdm6Ymw3wvmdXrVYRbFCfkMUtDrD7Bangs6z6xNfWa_BjJXh3F44O5ZhrOQASEO0i2E65lwryfCQpqdqnObBB4iLajWtk_qX2GwV0ZeSmVkIu5SDeKfnW8NVEm3fmYscGGBVFKb7uj&lib=MQZimxXEDnr6oCVh4_k1NmWl_CXXgBMN4";

export default function WeddingInvite({
  couple = { bride: "Leonita", groom: "Ridho" },
  dateISO = "2025-12-27T09:00:00",
  mapQuery = "-4.824874,104.917629",
}) {
  const audioRef = useRef(null);

  // Countdown
  const target = new Date(dateISO).getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // Messages
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load messages
  async function loadMessages() {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setMessages(data.reverse());
    } catch (e) {
      console.error("Load messages error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 12000);
    return () => clearInterval(interval);
  }, []);

  // Submit message
  async function handleSend(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !text.trim()) {
      setError("Nama dan pesan tidak boleh kosong.");
      return;
    }

    const payload = { name: name.trim(), text: text.trim() };

    try {
      setSending(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal mengirim pesan");

      await loadMessages();

      setName("");
      setText("");

      // mainkan audio setelah interaksi
      if (audioRef.current) audioRef.current.play().catch(() => {});
    } catch (err) {
      console.error(err);
      setError("Gagal mengirim pesan — coba lagi.");
    } finally {
      setSending(false);
    }
  }

  // Audio play on user interaction
  function handlePlayAudio() {
    if (audioRef.current) audioRef.current.play().catch(() => {});
  }

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white to-pink-50 text-gray-800"
      onClick={handlePlayAudio} // klik mana saja untuk play audio
    >
      <audio
        ref={audioRef}
        src="/music.mp3"
        preload="auto"
        loop
        playsInline
        style={{ display: "none" }}
      />

      <header className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Undangan Pernikahan</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Kepada yang terhormat, mohon doa restu atas pernikahan kami
        </p>
      </header>

      <main className="max-w-4xl mx-auto p-6 grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Left */}
        <section className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow text-center">
          <div className="text-sm text-gray-500">Dengan penuh cinta</div>
          <h2 className="mt-3 text-2xl font-bold">{couple.bride}</h2>
          <div className="mt-1 text-gray-500">&</div>
          <h2 className="mt-1 text-2xl font-bold">{couple.groom}</h2>
          <p className="mt-4 text-sm text-gray-600">
            Tanggal: <strong>{new Date(dateISO).toLocaleString()}</strong>
          </p>
        </section>

        {/* Countdown */}
        <section className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow">
          <h3 className="text-xl font-semibold">Countdown</h3>
          <div className="mt-4 flex gap-3 items-center">
            {[days, hours, minutes, seconds].map((val, i) => (
              <div
                key={i}
                className="px-3 py-2 bg-gray-100 rounded-lg text-center min-w-[48px]"
              >
                <div className="text-sm">{val}</div>
                <div className="text-xs text-gray-500">
                  {["Hari", "Jam", "Menit", "Detik"][i]}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Messages */}
        <section className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow">
          <h4 className="font-semibold">Kirim Pesan & Doa</h4>

          <form onSubmit={handleSend} className="mt-3">
            <label className="text-sm">Nama</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="Nama Anda"
            />
            <label className="text-sm mt-3">Pesan</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="Tulis pesan untuk mempelai..."
            ></textarea>

            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

            <button
              type="submit"
              disabled={sending}
              className="mt-3 w-full px-3 py-2 bg-pink-500 text-white rounded-lg"
            >
              {sending ? "Mengirim..." : "Kirim"}
            </button>
          </form>

          <div className="mt-4 space-y-3 max-h-48 overflow-auto pr-2">
            {loading && <div className="text-sm text-gray-500">Memuat pesan...</div>}
            {!loading && messages.length === 0 && (
              <div className="text-sm text-gray-500">Belum ada pesan.</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded-lg border">
                <div className="text-sm font-semibold">{m.name}</div>
                <div className="text-sm text-gray-700">{m.text}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map */}
        <section className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow">
          <h4 className="font-semibold">Lokasi Acara</h4>
          <div className="mt-4 w-full aspect-video rounded-lg overflow-hidden border">
            <iframe
              title="google-map"
              src={mapSrc}
              loading="lazy"
              className="w-full h-full border-0"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg bg-gray-100"
            >
              Buka di Google Maps
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(mapsUrl);
                alert("Link Google Maps disalin ke clipboard");
              }}
              className="px-3 py-2 rounded-lg bg-gray-100"
            >
              Salin Link
            </button>
          </div>
        </section>
      </main>

      <footer className="text-center p-6 text-sm text-gray-500">
        Made with ❤️ — Ubah teks, tanggal, dan lokasi sesuai kebutuhan.
      </footer>
    </div>
  );
}
