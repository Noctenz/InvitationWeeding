import React, { useEffect, useState, useRef } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbx6Xchfp7CHfPn8v1hoye96Y9dtTVI94Q9-bXyp6Ts3qOLz4mLAk-AjpzMmXqHZkpj4fQ/exec";

export default function WeddingInvite({
  couple = { bride: "Leonita", groom: "Ridho" },
  dateISO = "2025-12-27T09:00:00",
  mapQuery = "-4.824874,104.917629",
}) {
  // AUDIO REF (ada <audio id="weddingMusic" /> di return)
  const audioRef = useRef(null);

  // === MUSIC PLAY ON LOAD (attempt) ===
  useEffect(() => {
    const audio = document.getElementById("weddingMusic");
    if (audio) {
      audio.volume = 1.0;
      // coba play (jika browser mengizinkan karena user interaction sebelumnya)
      audio.play().catch(() => {});
      audioRef.current = audio;
    }
  }, []);

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

  // Messages (SERVER via Google Apps Script)
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load messages from API
  async function loadMessages(signal) {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setMessages(data.reverse());
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error("Load messages error:", e);
      }
    } finally {
      setLoading(false);
    }
  }

  // initial load + polling setiap 12 detik
  useEffect(() => {
    const controller = new AbortController();
    loadMessages(controller.signal);
    const id = setInterval(() => loadMessages(), 12000);
    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, []);

  // submit message -> POST to Google Apps Script
  async function handleSend(e) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !text.trim()) {
      setError("Nama dan pesan tidak boleh kosong.");
      return;
    }

    const payload = {
      name: name.trim(),
      text: text.trim(),
    };

    try {
      setSending(true);
      const res = await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal mengirim pesan");

      // sukses -> reload messages (server is source of truth)
      await loadMessages();

      // reset form
      setName("");
      setText("");

      // kalau audio belum playing, coba play (di kasus user klik envelope awalnya memicu play)
      const audio = audioRef.current || document.getElementById("weddingMusic");
      if (audio) audio.play().catch(() => {});
    } catch (err) {
      console.error(err);
      setError("Gagal mengirim pesan — coba lagi.");
    } finally {
      setSending(false);
    }
  }

  // NOTE: clearing all messages requires action di spreadsheet (admin).
  // Kita tampilkan instruksi ketika user klik "Bersihkan".
  function handleClear() {
    const want = confirm(
      "Mengosongkan pesan memerlukan akses ke Google Spreadsheet. Kamu ingin membuka spreadsheet sekarang?"
    );
    if (want) {
      // buka spreadsheet di tab baru (user harus hapus manual)
      // Jika kamu ingin fitur hapus otomatis, kita perlu menambahkan endpoint di Apps Script.
      window.open("https://docs.google.com/spreadsheets", "_blank");
    }
  }

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 text-gray-800">
      {/* === MUSIC PLAYER (HIDDEN) === */}
      <audio
        id="weddingMusic"
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
        {/* Left: Hero + Names */}
        <section className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow">
          <div className="text-center">
            <div className="text-sm text-gray-500">Dengan penuh cinta</div>
            <h2 className="mt-3 text-2xl font-bold">Leonita</h2>
            <div className="mt-1 text-gray-500">&</div>
            <h2 className="mt-1 text-2xl font-bold">Ridho</h2>

            <p className="mt-4 text-sm text-gray-600">
              Tanggal: <strong>{new Date(dateISO).toLocaleString()}</strong>
            </p>

            <div className="mt-6">
              <button
                onClick={() =>
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
                }
                className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow-sm hover:bg-pink-600"
              >
                Kirim Pesan untuk Mempelai
              </button>
            </div>
          </div>
        </section>

        {/* Middle: Countdown */}
        <section className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Countdown</h3>
              <p className="text-sm text-gray-500">Sampai hari bahagia</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3 items-center">
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-center min-w-[64px]">
                <div className="text-sm">{days}</div>
                <div className="text-xs text-gray-500">Hari</div>
              </div>
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-center min-w-[48px]">
                <div className="text-sm">{hours}</div>
                <div className="text-xs text-gray-500">Jam</div>
              </div>
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-center min-w-[48px]">
                <div className="text-sm">{minutes}</div>
                <div className="text-xs text-gray-500">Menit</div>
              </div>
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-center min-w-[48px]">
                <div className="text-sm">{seconds}</div>
                <div className="text-xs text-gray-500">Detik</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg overflow-hidden">
              <img src={`./hero.png`} alt="hero" className="w-full h-44 object-cover" />
            </div>

            <div className="p-3 flex flex-col justify-center">
              <p className="text-sm text-gray-600">
                Kami menantikan kehadiran Anda pada hari pernikahan kami. Silakan kirim pesan hangat atau doa melalui form di samping.
              </p>
            </div>
          </div>
        </section>

        {/* Messages + Map */}
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

            <div className="flex gap-2 mt-3">
              <button type="submit" disabled={sending} className="flex-1 px-3 py-2 bg-pink-500 text-white rounded-lg">
                {sending ? "Mengirim..." : "Kirim"}
              </button>
              <button type="button" onClick={handleClear} className="px-3 py-2 bg-gray-200 rounded-lg">
                Bersihkan
              </button>
            </div>
          </form>

          <div className="mt-4">
            <h5 className="text-sm font-medium">Pesan Terkini</h5>

            <div className="mt-2 space-y-3 max-h-48 overflow-auto pr-2">
              {loading && <div className="text-sm text-gray-500">Memuat pesan...</div>}
              {!loading && messages.length === 0 && <div className="text-sm text-gray-500">Belum ada pesan.</div>}

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
          </div>
        </section>

        {/* Map big section */}
        <section className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow">
          <h4 className="font-semibold">Lokasi Acara</h4>
          <p className="text-sm text-gray-500">{mapQuery}</p>
          <div className="mt-4 w-full aspect-video rounded-lg overflow-hidden border">
            <iframe title="google-map" src={mapSrc} loading="lazy" className="w-full h-full border-0" />
          </div>

          <div className="mt-3 flex gap-2">
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-gray-100">
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
