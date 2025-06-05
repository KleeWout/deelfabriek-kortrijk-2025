'use client';
import { useEffect, useState } from 'react';
import { Clock, Check } from 'phosphor-react';

const days = [
  'Maandag',
  'Dinsdag',
  'Woensdag',
  'Donderdag',
  'Vrijdag',
  'Zaterdag',
  'Zondag',
];

function pad(num: number) {
  return num.toString().padStart(2, '0');
}

function timeStr(date: string | null) {
  if (!date) return '';
  const d = new Date(date);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function OpeningsurenPage() {
  const [openingHours, setOpeningHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const backendUrl = 'https://api-deelfabriek.woutjuuh02.be/openinghours';

  useEffect(() => {
    setLoading(true);
    fetch(backendUrl)
      .then(async (res) => {
        if (!res.ok) throw new Error('Fout bij ophalen openingsuren');
        const data = await res.json();
        setOpeningHours(data);
      })
      .catch(() => setError('Fout bij ophalen openingsuren'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    idx: number,
    field: string,
    value: string | boolean
  ) => {
    setOpeningHours((hours) =>
      hours.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
    );
  };

  const handleSave = async (idx: number) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    const day = openingHours[idx];
    try {
      const res = await fetch(`${backendUrl}/${day.idDay}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(day),
      });
      if (!res.ok) throw new Error('Fout bij opslaan');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Fout bij opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Laden...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Instellingen</h1>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="grid grid-cols-6 gap-4 pb-4 border-b font-semibold text-gray-700">
          <div>Dag</div>
          <div className="col-span-2">Ochtend</div>
          <div className="col-span-2">Middag</div>
          <div>Gesloten</div>
        </div>
        {openingHours.map((h, idx) => (
          <div
            key={h.idDay}
            className="grid grid-cols-6 gap-4 items-center py-3 border-b last:border-b-0"
          >
            <div className="font-medium">{days[idx]}:</div>
            {/* Ochtend */}
            <div className="flex items-center gap-2">
              <input
                type="time"
                className="input input-bordered w-24"
                value={h.openTimeVm || ''}
                onChange={(e) =>
                  handleChange(idx, 'openTimeVm', e.target.value)
                }
                disabled={h.gesloten}
              />
              <span>tot</span>
              <input
                type="time"
                className="input input-bordered w-24"
                value={h.closeTimeVm || ''}
                onChange={(e) =>
                  handleChange(idx, 'closeTimeVm', e.target.value)
                }
                disabled={h.gesloten}
              />
            </div>
            {/* Middag */}
            <div className="flex items-center gap-2">
              <input
                type="time"
                className="input input-bordered w-24"
                value={h.openTimeNm || ''}
                onChange={(e) =>
                  handleChange(idx, 'openTimeNm', e.target.value)
                }
                disabled={h.gesloten}
              />
              <span>tot</span>
              <input
                type="time"
                className="input input-bordered w-24"
                value={h.closeTimeNm || ''}
                onChange={(e) =>
                  handleChange(idx, 'closeTimeNm', e.target.value)
                }
                disabled={h.gesloten}
              />
            </div>
            {/* Gesloten */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={h.gesloten}
                onChange={(e) =>
                  handleChange(idx, 'gesloten', e.target.checked)
                }
              />
              <span>Gesloten</span>
            </div>
            <button
              className="ml-2 px-3 py-2 rounded bg-primarygreen-1 text-white font-bold flex items-center gap-2 disabled:opacity-50"
              onClick={() => handleSave(idx)}
              disabled={saving}
            >
              <Check size={20} /> Opslaan
            </button>
            {success && (
              <span className="text-green-600 ml-2">Opgeslagen!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
