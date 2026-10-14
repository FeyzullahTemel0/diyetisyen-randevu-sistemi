"use client";

import { useState } from "react";
import {
  MODE_LABEL,
  STATUS_LABEL,
  addDays,
  apptsForDay,
  formatLong,
  formatShort,
  fromISO,
  serviceMinutes,
  serviceName,
  type Appt,
  type ApptStatus,
} from "@/lib/data";
import { useToday } from "@/lib/useToday";

type View = "client" | "expert";
type Filter = "all" | ApptStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "confirmed", label: "Onaylı" },
  { id: "pending", label: "Bekliyor" },
  { id: "done", label: "Tamamlandı" },
  { id: "cancelled", label: "İptal" },
];

const HABITS = [
  "Öğünleri not etmek",
  "Gün içinde su molaları",
  "Sebzeli bir öğün",
  "Yürüyüş / hareket molası",
];

export default function Panel() {
  const [view, setView] = useState<View>("client");
  return (
    <div className="panel">
      <div className="panel-top">
        <div className="tabs" role="tablist" aria-label="Panel görünümü">
          {(["client", "expert"] as View[]).map((v) => (
            <button
              key={v}
              role="tab"
              id={`tab-${v}`}
              aria-selected={view === v}
              aria-controls={`pane-${v}`}
              tabIndex={view === v ? 0 : -1}
              className={view === v ? "on" : ""}
              onClick={() => setView(v)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  setView(v === "client" ? "expert" : "client");
                  document.getElementById(`tab-${v === "client" ? "expert" : "client"}`)?.focus();
                }
              }}
            >
              {v === "client" ? "Danışan görünümü" : "Uzman görünümü"}
            </button>
          ))}
        </div>
        <span className="pill-demo">Tüm veriler kurgusal örnektir</span>
      </div>
      <div role="tabpanel" id={`pane-${view}`} aria-labelledby={`tab-${view}`}>
        {view === "client" ? <ClientView /> : <ExpertView />}
      </div>
    </div>
  );
}

function ClientView() {
  const today = useToday();
  const [done, setDone] = useState<boolean[]>([true, false, true, false]);
  const [reschedule, setReschedule] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const pct = Math.round((done.filter(Boolean).length / HABITS.length) * 100);
  let upcoming = today ? addDays(today, 3) : "";
  if (upcoming && fromISO(upcoming).getDay() === 0) upcoming = addDays(upcoming, 1);

  return (
    <div className="client-grid">
      <section className="p-card">
        <h3>Sıradaki görüşme</h3>
        {cancelled ? (
          <p className="muted">Örnek randevu iptal edildi. (Demo; hiçbir şey gönderilmedi.)</p>
        ) : (
          <>
            <p className="big-date">{upcoming ? formatLong(upcoming) : "…"}</p>
            <p className="muted">11:00 · Takip görüşmesi · Online · 30 dk (örnek)</p>
            <div className="row-actions">
              <button className="btn btn-small btn-ghost" onClick={() => setReschedule((r) => !r)} aria-expanded={reschedule}>
                Saati değiştir
              </button>
              <button className="btn btn-small btn-ghost" onClick={() => setCancelled(true)}>
                İptal et
              </button>
            </div>
            {reschedule && (
              <div className="resched">
                <p>Örnek alternatif saatler:</p>
                <p className="muted">Gerçek bir sistemde seçiminiz uzmana iletilirdi; burada hiçbir şey gönderilmez.</p>
                <a className="btn btn-small btn-primary" href="#randevu">Randevu akışına git</a>
              </div>
            )}
          </>
        )}
        {cancelled && (
          <button className="btn btn-small btn-ghost" onClick={() => setCancelled(false)}>Geri al</button>
        )}
      </section>

      <section className="p-card">
        <h3>Haftalık alışkanlıklar</h3>
        <ul className="habits">
          {HABITS.map((h, i) => (
            <li key={h}>
              <label>
                <input
                  type="checkbox"
                  checked={done[i]}
                  onChange={() => setDone(done.map((d, j) => (j === i ? !d : d)))}
                />
                <span>{h}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Örnek alışkanlık ilerlemesi">
          <div style={{ width: `${pct}%` }} />
        </div>
        <p className="muted small">%{pct} tamamlandı · yalnızca örnek bir takip düzenidir.</p>
      </section>

      <section className="p-card wide">
        <h3>Örnek öğün planı taslağı</h3>
        <div className="meal-row">
          {[
            ["Sabah", "Yulaflı kase, mevsim meyvesi"],
            ["Öğle", "Mercimekli salata, tam tahıllı ekmek"],
            ["Ara", "Yoğurt, bir avuç ceviz"],
            ["Akşam", "Fırın sebze, bulgur pilavı"],
          ].map(([k, v], i) => (
            <div key={k} className={`meal m${i}`}>
              <b>{k}</b>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <p className="muted small">Genel bir örnektir; kişiye özel tıbbi öneri veya tedavi değildir.</p>
      </section>
    </div>
  );
}

function ExpertView() {
  const today = useToday();
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, ApptStatus>>({});

  if (!today) return <div className="cal-skeleton" aria-busy="true">Panel yükleniyor…</div>;

  const iso = addDays(today, offset);
  const all: Appt[] = apptsForDay(iso, offset).map((a) => ({ ...a, status: overrides[a.id] ?? a.status }));
  const list = filter === "all" ? all : all.filter((a) => a.status === filter);
  const sel = all.find((a) => a.id === selected) ?? null;
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const setStatus = (id: string, s: ApptStatus) => setOverrides((o) => ({ ...o, [id]: s }));

  return (
    <div className="expert">
      <div className="day-strip" role="group" aria-label="Gün seçimi">
        {days.map((d, i) => {
          const s = formatShort(d);
          return (
            <button key={d} className={i === offset ? "on" : ""} aria-pressed={i === offset} onClick={() => { setOffset(i); setSelected(null); }}>
              <small>{i === 0 ? "Bugün" : s.dow}</small>
              <b>{s.day}</b>
            </button>
          );
        })}
      </div>

      <div className="filters" role="group" aria-label="Durum filtresi">
        {FILTERS.map((f) => {
          const n = f.id === "all" ? all.length : all.filter((a) => a.status === f.id).length;
          return (
            <button key={f.id} className={filter === f.id ? "on" : ""} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label} <span>{n}</span>
            </button>
          );
        })}
      </div>

      <div className="expert-grid">
        <div className="agenda">
          <h3>{formatLong(iso)}</h3>
          {all.length === 0 ? (
            <p className="empty">Bu gün kapalı (örnek takvim).</p>
          ) : list.length === 0 ? (
            <p className="empty">Bu durumda randevu yok.</p>
          ) : (
            <ul>
              {list.map((a) => (
                <li key={a.id}>
                  <button className={`appt ${selected === a.id ? "on" : ""}`} onClick={() => setSelected(a.id)} aria-pressed={selected === a.id}>
                    <time>{a.time}</time>
                    <span className="who">
                      <b>{a.client}</b>
                      <small>{serviceName(a.service)} · {MODE_LABEL[a.mode]}</small>
                    </span>
                    <span className={`badge ${a.status}`}>{STATUS_LABEL[a.status]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="detail" aria-live="polite">
          {sel ? (
            <>
              <h3>Randevu detayı</h3>
              <span className={`badge ${sel.status}`}>{STATUS_LABEL[sel.status]}</span>
              <dl>
                <div><dt>Danışan</dt><dd>{sel.client}</dd></div>
                <div><dt>Saat</dt><dd>{sel.time} · {serviceMinutes(sel.service)} dk (örnek)</dd></div>
                <div><dt>Tür</dt><dd>{serviceName(sel.service)}</dd></div>
                <div><dt>Biçim</dt><dd>{MODE_LABEL[sel.mode]}</dd></div>
                <div><dt>Not</dt><dd>{sel.note}</dd></div>
              </dl>
              <div className="row-actions">
                {sel.status === "pending" && (
                  <button className="btn btn-small btn-primary" onClick={() => setStatus(sel.id, "confirmed")}>Onayla</button>
                )}
                {sel.status === "confirmed" && (
                  <button className="btn btn-small btn-primary" onClick={() => setStatus(sel.id, "done")}>Tamamlandı say</button>
                )}
                {(sel.status === "pending" || sel.status === "confirmed") && (
                  <button className="btn btn-small btn-ghost" onClick={() => setStatus(sel.id, "cancelled")}>İptal et</button>
                )}
                {(sel.status === "cancelled" || sel.status === "done") && (
                  <button className="btn btn-small btn-ghost" onClick={() => setStatus(sel.id, "pending")}>Bekliyor’a al</button>
                )}
              </div>
              <p className="muted small">Değişiklikler yalnızca bu sayfada, geçici olarak görünür.</p>
            </>
          ) : (
            <p className="empty">Ayrıntıları görmek için listeden bir randevu seçin.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
