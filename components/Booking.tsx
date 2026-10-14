"use client";

import { useMemo, useState } from "react";
import {
  MODE_LABEL,
  SERVICES,
  TIMES,
  dayOpenCount,
  formatLong,
  fromISO,
  addDays,
  slotStatus,
  toISO,
  type Mode,
  type ServiceId,
} from "@/lib/data";
import { useToday } from "@/lib/useToday";

const STEPS = ["Görüşme türü", "Görüşme biçimi", "Gün", "Saat", "İletişim", "Onay"];
const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

type Errors = Partial<Record<"name" | "email" | "phone" | "consent", string>>;

function validate(v: { name: string; email: string; phone: string; consent: boolean }): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Lütfen en az 2 karakterlik örnek bir ad yazın.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = "Geçerli bir örnek e-posta biçimi girin (ör. ornek@example.com).";
  if (v.phone.trim() && !/^[0-9 +()-]{7,18}$/.test(v.phone.trim()))
    e.phone = "Telefon yalnızca rakam, boşluk ve + ( ) - içerebilir.";
  if (!v.consent) e.consent = "Devam etmek için demo bilgilendirmesini onaylayın.";
  return e;
}

export default function Booking() {
  const today = useToday();
  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceId | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "", consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [code, setCode] = useState<string | null>(null);

  const svc = SERVICES.find((s) => s.id === service);
  const minDate = today ? addDays(today, 1) : "";
  const maxDate = today ? addDays(today, 75) : "";

  const view = useMemo(() => {
    if (!today) return null;
    const t = fromISO(today);
    return month ?? { y: t.getFullYear(), m: t.getMonth() };
  }, [today, month]);

  const cells = useMemo(() => {
    if (!view) return [];
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7;
    const count = new Date(view.y, view.m + 1, 0).getDate();
    const out: (string | null)[] = Array(lead).fill(null);
    for (let d = 1; d <= count; d++) out.push(toISO(new Date(view.y, view.m, d)));
    return out;
  }, [view]);

  const monthLabel = view
    ? new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(
        new Date(view.y, view.m, 1),
      )
    : "";

  const canPrev = view && today ? view.y * 12 + view.m > fromISO(today).getFullYear() * 12 + fromISO(today).getMonth() : false;
  const canNext = view && maxDate ? view.y * 12 + view.m < fromISO(maxDate).getFullYear() * 12 + fromISO(maxDate).getMonth() : false;

  function shiftMonth(delta: number) {
    if (!view) return;
    const d = new Date(view.y, view.m + delta, 1);
    setMonth({ y: d.getFullYear(), m: d.getMonth() });
  }

  function pickService(id: ServiceId) {
    setService(id);
    const s = SERVICES.find((x) => x.id === id)!;
    if (mode && !s.modes.includes(mode)) setMode(null);
    if (s.modes.length === 1) setMode(s.modes[0]);
    setDate(null);
    setTime(null);
  }

  function pickMode(m: Mode) {
    setMode(m);
    setDate(null);
    setTime(null);
  }

  const canContinue =
    (step === 0 && !!service) ||
    (step === 1 && !!mode) ||
    (step === 2 && !!date) ||
    (step === 3 && !!time) ||
    step === 4;

  function next() {
    if (step === 4) {
      const e = validate(form);
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setStep((s) => Math.min(5, s + 1));
  }

  function confirm() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let c = "";
    for (let i = 0; i < 5; i++) c += chars[Math.floor(Math.random() * chars.length)];
    setCode(`DEMO-${c}`);
    // Girilen kişisel alanlar bellekten de temizlenir.
    setForm({ name: "", email: "", phone: "", note: "", consent: false });
  }

  function reset() {
    setStep(0);
    setService(null);
    setMode(null);
    setDate(null);
    setTime(null);
    setCode(null);
    setErrors({});
  }

  if (code && svc && mode && date && time) {
    return (
      <div className="book-card success" role="status">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h3>Demo randevunuz oluşturuldu</h3>
        <p className="muted">
          Bu yalnızca örnek bir ekrandır. Hiçbir bilgi gönderilmedi veya saklanmadı; e-posta ya da SMS iletilmeyecek.
        </p>
        <div className="code-box">
          <span>Örnek randevu kodu</span>
          <strong>{code}</strong>
        </div>
        <dl className="summary">
          <div><dt>Görüşme</dt><dd>{svc.name} · {svc.minutes} dk (örnek)</dd></div>
          <div><dt>Biçim</dt><dd>{MODE_LABEL[mode]}</dd></div>
          <div><dt>Tarih</dt><dd>{formatLong(date)}</dd></div>
          <div><dt>Saat</dt><dd>{time}</dd></div>
        </dl>
        <button className="btn btn-primary" onClick={reset}>Yeni demo randevu dene</button>
      </div>
    );
  }

  return (
    <div className="book-card">
      <div className="demo-banner" role="note">
        <strong>Bu bir demo; gerçek randevu oluşturmaz.</strong> Gerçek kişisel veya sağlık bilgisi girmeyin.
      </div>

      <ol className="stepper" aria-label="Randevu adımları">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "on" : i < step ? "done" : ""} aria-current={i === step ? "step" : undefined}>
            <span>{i < step ? "✓" : i + 1}</span>
            <em>{s}</em>
          </li>
        ))}
      </ol>

      <div className="step-body" aria-live="polite">
        {step === 0 && (
          <fieldset className="choices">
            <legend>Hangi görüşme türünü denemek istersiniz?</legend>
            {SERVICES.map((s) => (
              <button
                type="button"
                key={s.id}
                className={`choice ${service === s.id ? "sel" : ""}`}
                aria-pressed={service === s.id}
                onClick={() => pickService(s.id)}
              >
                <strong>{s.name}</strong>
                <span>{s.minutes} dk · örnek süre</span>
              </button>
            ))}
          </fieldset>
        )}

        {step === 1 && svc && (
          <fieldset className="choices">
            <legend>Görüşme biçimi</legend>
            {(["online", "in-person"] as Mode[]).map((m) => {
              const ok = svc.modes.includes(m);
              return (
                <button
                  type="button"
                  key={m}
                  disabled={!ok}
                  className={`choice ${mode === m ? "sel" : ""}`}
                  aria-pressed={mode === m}
                  onClick={() => pickMode(m)}
                >
                  <strong>{MODE_LABEL[m]}</strong>
                  <span>
                    {!ok
                      ? "Bu görüşme türü yalnızca online"
                      : m === "online"
                        ? "Görüntülü, her gün (Pazar hariç)"
                        : "Örnek günler: Salı, Perşembe, Cumartesi"}
                  </span>
                </button>
              );
            })}
          </fieldset>
        )}

        {step === 2 && mode && (
          <div>
            <p className="legend">Takvimden bir gün seçin</p>
            {!view ? (
              <div className="cal-skeleton" aria-busy="true">Takvim yükleniyor…</div>
            ) : (
              <div className="cal">
                <div className="cal-head">
                  <button type="button" className="icon-btn" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="Önceki ay">‹</button>
                  <strong>{monthLabel}</strong>
                  <button type="button" className="icon-btn" onClick={() => shiftMonth(1)} disabled={!canNext} aria-label="Sonraki ay">›</button>
                </div>
                <div className="cal-grid">
                  {WEEKDAYS.map((w) => (
                    <span key={w} className="cal-dow">{w}</span>
                  ))}
                  {cells.map((iso, i) => {
                    if (!iso) return <span key={`e${i}`} />;
                    const past = iso < minDate;
                    const open = !past && iso <= maxDate ? dayOpenCount(iso, mode) : 0;
                    const disabled = open === 0;
                    return (
                      <button
                        type="button"
                        key={iso}
                        disabled={disabled}
                        className={`cal-day ${date === iso ? "sel" : ""} ${past ? "past" : ""}`}
                        aria-pressed={date === iso}
                        aria-label={`${formatLong(iso)}${disabled ? (past ? ", geçmiş veya aynı gün" : ", uygun saat yok") : `, ${open} uygun saat`}`}
                        onClick={() => {
                          setDate(iso);
                          setTime(null);
                        }}
                      >
                        {fromISO(iso).getDate()}
                        {!disabled && <i aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
                <p className="hint">Geçmiş tarihler ve aynı gün seçilemez. Noktalı günlerde uygun saat vardır.</p>
              </div>
            )}
          </div>
        )}

        {step === 3 && date && mode && (
          <div>
            <p className="legend">{formatLong(date)} için saat seçin</p>
            <div className="slots">
              {TIMES.map((t) => {
                const st = slotStatus(date, t, mode);
                return (
                  <button
                    type="button"
                    key={t}
                    disabled={st !== "open"}
                    className={`slot ${st} ${time === t ? "sel" : ""}`}
                    aria-pressed={time === t}
                    onClick={() => setTime(t)}
                  >
                    <b>{t}</b>
                    <small>{st === "open" ? "Uygun" : st === "full" ? "Dolu" : "Kapalı"}</small>
                  </button>
                );
              })}
            </div>
            <div className="legend-row" aria-hidden="true">
              <span><i className="lg open" /> Uygun</span>
              <span><i className="lg full" /> Dolu</span>
              <span><i className="lg closed" /> Kapalı</span>
            </div>
          </div>
        )}

        {step === 4 && (
          <form className="contact" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
            <p className="legend">İletişim alanları (örnek bilgi girin)</p>
            <div className="warn" role="note">
              Bu bir demo; gerçek randevu oluşturmaz. Gerçek kişisel veya sağlık bilgisi girmeyin. Girdiğiniz hiçbir şey gönderilmez veya saklanmaz.
            </div>
            <label>
              Ad soyad (örnek)
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="off"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "err-name" : undefined}
                placeholder="Örnek Kişi"
              />
              {errors.name && <span id="err-name" className="err">{errors.name}</span>}
            </label>
            <label>
              E-posta (örnek)
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="off"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
                placeholder="ornek@example.com"
              />
              {errors.email && <span id="err-email" className="err">{errors.email}</span>}
            </label>
            <label>
              Telefon (isteğe bağlı, örnek)
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                autoComplete="off"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "err-phone" : undefined}
                placeholder="0 500 000 00 00"
              />
              {errors.phone && <span id="err-phone" className="err">{errors.phone}</span>}
            </label>
            <label>
              Not (isteğe bağlı, sağlık bilgisi yazmayın)
              <textarea
                rows={3}
                maxLength={200}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Örn. Görüşmede konuşmak istediğim genel bir konu"
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                aria-invalid={!!errors.consent}
              />
              <span>Bunun bir demo olduğunu ve gerçek bilgi girmediğimi anlıyorum.</span>
            </label>
            {errors.consent && <span className="err">{errors.consent}</span>}
            <button type="submit" hidden />
          </form>
        )}

        {step === 5 && svc && mode && date && time && (
          <div>
            <p className="legend">Son kontrol</p>
            <dl className="summary">
              <div><dt>Görüşme</dt><dd>{svc.name} · {svc.minutes} dk (örnek)</dd></div>
              <div><dt>Biçim</dt><dd>{MODE_LABEL[mode]}</dd></div>
              <div><dt>Tarih</dt><dd>{formatLong(date)}</dd></div>
              <div><dt>Saat</dt><dd>{time}</dd></div>
              <div><dt>İletişim</dt><dd>{form.name || "—"} · {form.email || "—"}</dd></div>
            </dl>
            <p className="hint">Onayladığınızda yalnızca sahte bir başarı mesajı ve örnek kod göreceksiniz.</p>
          </div>
        )}
      </div>

      <div className="step-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Geri
        </button>
        {step < 5 ? (
          <button type="button" className="btn btn-primary" onClick={next} disabled={!canContinue}>
            Devam
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={confirm}>
            Demo randevuyu onayla
          </button>
        )}
      </div>
    </div>
  );
}
