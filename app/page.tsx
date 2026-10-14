import Booking from "@/components/Booking";
import Header from "@/components/Header";
import Panel from "@/components/Panel";
import Reveal from "@/components/Reveal";
import { FAQS, SERVICES } from "@/lib/data";

const SPECIALTIES = [
  "Alışkanlık odaklı beslenme",
  "Öğün planlama ve mutfak düzeni",
  "Yoğun tempoda pratik beslenme",
  "Sporcu günlük rutinleri (genel)",
];

const STEPS = [
  ["01", "Randevunuzu seçin", "Görüşme türünü, biçimi ve size uygun gün ile saati takvimden belirlersiniz."],
  ["02", "İlk görüşme", "Günlük düzeninizi, tercihlerinizi ve merak ettiklerinizi birlikte konuşuruz."],
  ["03", "Takip görüşmeleri", "Alışkanlık günlüğünüze bakar, planı hayatınıza uyacak şekilde birlikte sadeleştiririz."],
];

function HeroPreview() {
  const days = [
    ["Pzt", "12", "off"], ["Sal", "13", ""], ["Çar", "14", "sel"], ["Per", "15", ""], ["Cum", "16", "full"],
  ];
  return (
    <div className="hero-preview" aria-hidden="true">
      <div className="hp-window">
        <div className="hp-bar"><i /><i /><i /><span>Örnek randevu ekranı</span></div>
        <div className="hp-body">
          <p className="hp-title">Görüşme seçin</p>
          <div className="hp-chips"><b>İlk görüşme</b><span>Takip</span><span>Online</span></div>
          <div className="hp-days">
            {days.map(([d, n, c]) => (
              <div key={n} className={`hp-day ${c}`}><small>{d}</small><b>{n}</b></div>
            ))}
          </div>
          <div className="hp-slots">
            {["09:30", "10:00", "11:30", "14:00", "15:30", "16:00"].map((t, i) => (
              <span key={t} className={i === 2 ? "sel" : i === 1 || i === 4 ? "full" : ""}>{t}</span>
            ))}
          </div>
          <div className="hp-cta">Randevuyu onayla</div>
        </div>
      </div>
      <div className="hp-plate">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle cx="60" cy="60" r="56" fill="#fff" stroke="#d6e6dc" strokeWidth="2" />
          <path d="M60 60 L60 14 A46 46 0 0 1 104 74 Z" fill="#3ddc97" />
          <path d="M60 60 L104 74 A46 46 0 0 1 36 100 Z" fill="#f5b83d" />
          <path d="M60 60 L36 100 A46 46 0 0 1 60 14 Z" fill="#12372a" />
          <circle cx="60" cy="60" r="12" fill="#fff" />
        </svg>
        <span>Örnek tabak düzeni</span>
      </div>
      <div className="hp-note">Haftalık takip<div className="hp-spark"><i style={{ height: "40%" }} /><i style={{ height: "65%" }} /><i style={{ height: "50%" }} /><i style={{ height: "85%" }} /><i style={{ height: "70%" }} /></div></div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#icerik">İçeriğe geç</a>
      <div className="demo-top">Demo: Denge Beslenme Atölyesi kurgusal bir markadır. Gerçek randevu, e-posta veya ödeme yoktur.</div>
      <Header />
      <main id="icerik">
        <section id="top" className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="eyebrow">Diyetisyen randevu sistemi demosu</p>
              <h1>Beslenme görüşmenizi <em>birkaç dokunuşta</em> planlayın.</h1>
              <p className="lead">
                Görüşme türünü seçin, takvimde size uygun günü ve saati görün, tek ekranda onaylayın. Sakin, anlaşılır ve telefonda da rahat kullanılan bir randevu deneyimi.
              </p>
              <div className="hero-actions">
                <a href="#randevu" className="btn btn-primary btn-lg">Randevu al</a>
                <a href="#panel" className="btn btn-ghost btn-lg">Panelleri dene</a>
              </div>
              <ul className="hero-points">
                <li>Online ve yüz yüze seçenek</li>
                <li>Dolu / kapalı saatler net görünür</li>
                <li>Veri toplamaz, kayıt tutmaz</li>
              </ul>
            </div>
            <HeroPreview />
          </div>
        </section>

        <section id="hakkinda" className="section">
          <div className="wrap about">
            <Reveal>
              <div className="portrait" aria-hidden="true">
                <svg viewBox="0 0 320 380" role="img">
                  <rect width="320" height="380" rx="28" fill="#12372a" />
                  <circle cx="240" cy="90" r="64" fill="#f5b83d" />
                  <circle cx="80" cy="300" r="90" fill="#3ddc97" />
                  <path d="M0 250 Q110 190 200 260 T320 230 V380 H0Z" fill="#fbf8f1" opacity=".12" />
                  <text x="30" y="70" fill="#fbf8f1" fontFamily="serif" fontSize="44">D.</text>
                </svg>
                <span>Kurgusal profil</span>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <p className="eyebrow">Diyetisyen profili</p>
              <h2>Dyt. Deniz Örnek <small>(kurgusal isim)</small></h2>
              <p>
                Demo için oluşturulmuş bir karakterdir; gerçek bir kişi, unvan, diploma veya başarı iddiası içermez. Çalışma yaklaşımı örnek olarak şöyle kurgulanmıştır: yasak listeleri yerine sürdürülebilir alışkanlıklar, küçük ve uygulanabilir adımlar.
              </p>
              <h3>Örnek uzmanlık alanları</h3>
              <ul className="tags">{SPECIALTIES.map((s) => <li key={s}>{s}</li>)}</ul>
              <h3>Görüşme biçimleri</h3>
              <ul className="tags alt"><li>Online (görüntülü)</li><li>Yüz yüze (örnek ofis)</li></ul>
              <p className="quote">“Önce günlük hayatınızı dinlerim; planı ona göre kurarız.” <small>— örnek yaklaşım cümlesi</small></p>
            </Reveal>
          </div>
        </section>

        <section id="hizmetler" className="section tinted">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Hizmetler</p>
              <h2>Dört örnek görüşme türü</h2>
              <p className="sub">Süre ve içerikler demo amaçlı örnektir.</p>
            </Reveal>
            <div className="svc-list">
              {SERVICES.map((s, i) => (
                <Reveal key={s.id} delay={i * 60} className="svc">
                  <span className="svc-min"><b>{s.minutes}</b> dk</span>
                  <div>
                    <h3>{s.name}</h3>
                    <p>{s.summary}</p>
                    <small>{s.modes.length === 1 ? "Yalnızca online" : "Online / yüz yüze"} · örnek</small>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="gorsel-h">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Atölyeden görünümler</p>
              <h2 id="gorsel-h">Menüden takibe, tek bir düzen</h2>
            </Reveal>
            <div className="compose">
              <Reveal className="cmp cmp-menu">
                <h3>Haftalık menü</h3>
                {[["Pzt", "Mercimek çorbası"], ["Sal", "Zeytinyağlı fasulye"], ["Çar", "Izgara sebzeli bulgur"], ["Per", "Nohutlu salata"]].map(([d, m]) => (
                  <p key={d}><b>{d}</b><span>{m}</span></p>
                ))}
                <small>Örnek menü</small>
              </Reveal>
              <Reveal className="cmp cmp-plate" delay={80}>
                <h3>Öğün dengesi</h3>
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="50" fill="#fbf8f1" />
                  <path d="M60 60 L60 10 A50 50 0 0 1 110 60 Z" fill="#3ddc97" />
                  <path d="M60 60 L110 60 A50 50 0 0 1 60 110 Z" fill="#f5b83d" />
                  <path d="M60 60 L60 110 A50 50 0 0 1 10 60 A50 50 0 0 1 60 10 Z" fill="#1d5a43" />
                </svg>
                <small>Genel bir tabak düzeni örneği</small>
              </Reveal>
              <Reveal className="cmp cmp-cal" delay={160}>
                <h3>Görüşme takvimi</h3>
                <div className="mini-cal" aria-hidden="true">
                  {Array.from({ length: 21 }, (_, i) => <i key={i} className={[3, 8, 12, 17].includes(i) ? "on" : [5, 14].includes(i) ? "alt" : ""} />)}
                </div>
                <small>Örnek doluluk</small>
              </Reveal>
              <Reveal className="cmp cmp-track" delay={240}>
                <h3>Takip paneli</h3>
                <div className="bars" aria-hidden="true">
                  {[55, 70, 45, 80, 65, 90, 75].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
                </div>
                <small>Alışkanlık tamamlama · örnek</small>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="surec" className="section dark">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Süreç</p>
              <h2>Üç adımda nasıl ilerler?</h2>
            </Reveal>
            <ol className="steps">
              {STEPS.map(([n, t, d], i) => (
                <li key={n}>
                  <Reveal delay={i * 80}><span>{n}</span><h3>{t}</h3><p>{d}</p></Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="randevu" className="section">
          <div className="wrap book-wrap">
            <Reveal className="book-intro">
              <p className="eyebrow">Randevu al</p>
              <h2>Demo randevu akışını deneyin</h2>
              <p>
                Görüşme türü, biçim, gün, saat ve iletişim adımlarından geçin. Yalnızca örnek bir başarı ekranı ve kod göreceksiniz; hiçbir veri dışarı gönderilmez veya saklanmaz.
              </p>
              <p className="muted small">Pazar günleri kapalıdır; yüz yüze görüşmeler örnek olarak salı, perşembe ve cumartesi günleridir.</p>
            </Reveal>
            <Booking />
          </div>
        </section>

        <section id="panel" className="section tinted">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">Panel demosu</p>
              <h2>Danışan ve uzman ekranlarını deneyin</h2>
              <p className="sub">Tüm isimler, saatler ve notlar kurgusaldır; sayfayı yenilediğinizde sıfırlanır.</p>
            </Reveal>
            <Panel />
          </div>
        </section>

        <section id="sss" className="section">
          <div className="wrap faq">
            <Reveal>
              <p className="eyebrow">Sık sorulan sorular</p>
              <h2>Aklınıza takılanlar</h2>
            </Reveal>
            <div>
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap">
          <strong>Denge Beslenme Atölyesi</strong>
          <p>
            Kurgusal demo projesidir. Hiçbir kişi, kurum veya yorum gerçek değildir. Bu sayfa teşhis, tedavi, kilo kaybı vaadi veya kişiye özel tıbbi öneri sunmaz; sağlık konularında yetkili bir sağlık profesyoneline danışın.
          </p>
        </div>
      </footer>
    </>
  );
}
