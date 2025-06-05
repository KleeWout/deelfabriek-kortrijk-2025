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

const dummyOpeningHours = [
  {
    idDay: 'maandag',
    openTimeVm: '08:00',
    closeTimeVm: '12:00',
    openTimeNm: '13:00',
    closeTimeNm: '17:00',
    gesloten: false,
  },
  {
    idDay: 'dinsdag',
    openTimeVm: '08:00',
    closeTimeVm: '12:00',
    openTimeNm: '13:00',
    closeTimeNm: '17:00',
    gesloten: false,
  },
  {
    idDay: 'woensdag',
    openTimeVm: '08:00',
    closeTimeVm: '12:00',
    openTimeNm: '',
    closeTimeNm: '',
    gesloten: false,
  },
  {
    idDay: 'donderdag',
    openTimeVm: '08:00',
    closeTimeVm: '12:00',
    openTimeNm: '',
    closeTimeNm: '',
    gesloten: false,
  },
  {
    idDay: 'vrijdag',
    openTimeVm: '08:00',
    closeTimeVm: '12:00',
    openTimeNm: '13:00',
    closeTimeNm: '17:00',
    gesloten: false,
  },
  {
    idDay: 'zaterdag',
    openTimeVm: '',
    closeTimeVm: '',
    openTimeNm: '',
    closeTimeNm: '',
    gesloten: true,
  },
  {
    idDay: 'zondag',
    openTimeVm: '',
    closeTimeVm: '',
    openTimeNm: '',
    closeTimeNm: '',
    gesloten: true,
  },
];

function pad(num: number) {
  return num.toString().padStart(2, '0');
}

function timeStr(date: string | null) {
  if (!date) return '';
  const d = new Date(date);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTime(val: string) {
  if (!val) return '';
  const [h, m] = val.split(':');
  return `${h?.padStart(2, '0') || '00'}:${m?.padStart(2, '0') || '00'}`;
}

export default function OpeningsurenPage() {
  const [openingHours, setOpeningHours] = useState<any[]>(dummyOpeningHours);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    idx: number,
    field: string,
    value: string | boolean
  ) => {
    setOpeningHours((hours) =>
      hours.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
    );
  };

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="p-8 bg-[#f3f6f8] min-h-screen">
      <h1 className="text-2xl font-extrabold mb-8 text-gray-900">
        Instellingen
      </h1>
      <div className="bg-white rounded-2xl shadow p-8 max-w-7xl mx-auto relative">
        <div
          className="grid grid-cols-12 gap-4 pb-4 border-b font-semibold text-gray-700"
          style={{ borderBottom: '1px solid #e5e7eb' }}
        >
          <div className="col-span-2">Dag</div>
          <div className="col-span-4">Ochtend</div>
          <div className="col-span-4">Middag</div>
          <div className="col-span-2 text-right pr-4">Gesloten</div>
        </div>
        {openingHours.map((h, idx) => (
          <div
            key={h.idDay}
            className="grid grid-cols-12 gap-4 items-center py-4 border-b last:border-b-0 border-gray-200"
            style={{ minHeight: 56 }}
          >
            <div className="col-span-2 font-medium text-gray-800 pl-1">
              {days[idx]}:
            </div>
            {/* Ochtend */}
            <div className="col-span-4 flex items-center gap-2">
              <input
                type="time"
                className="w-28 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primarygreen-1 transition"
                value={formatTime(h.openTimeVm) || ''}
                onChange={(e) =>
                  handleChange(idx, 'openTimeVm', e.target.value)
                }
                disabled={h.gesloten}
              />
              <span className="text-gray-400">tot</span>
              <input
                type="time"
                className="w-28 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primarygreen-1 transition"
                value={formatTime(h.closeTimeVm) || ''}
                onChange={(e) =>
                  handleChange(idx, 'closeTimeVm', e.target.value)
                }
                disabled={h.gesloten}
              />
            </div>
            {/* Middag */}
            <div className="col-span-4 flex items-center gap-2">
              <input
                type="time"
                className="w-28 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primarygreen-1 transition"
                value={formatTime(h.openTimeNm) || ''}
                onChange={(e) =>
                  handleChange(idx, 'openTimeNm', e.target.value)
                }
                disabled={h.gesloten}
              />
              <span className="text-gray-400">tot</span>
              <input
                type="time"
                className="w-28 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primarygreen-1 transition"
                value={formatTime(h.closeTimeNm) || ''}
                onChange={(e) =>
                  handleChange(idx, 'closeTimeNm', e.target.value)
                }
                disabled={h.gesloten}
              />
            </div>
            {/* Gesloten */}
            <div className="col-span-2 flex items-center justify-end pr-4">
              <input
                type="checkbox"
                checked={h.gesloten}
                onChange={(e) =>
                  handleChange(idx, 'gesloten', e.target.checked)
                }
                className="w-5 h-5 accent-primarygreen-1 rounded border-2 border-primarygreen-1 focus:ring-2 focus:ring-primarygreen-1"
              />
              <span className="ml-2 text-gray-700 font-semibold">Gesloten</span>
            </div>
          </div>
        ))}
        {/* Save button */}
        <div className="flex justify-end pt-8">
          <button
            className="px-8 py-3 rounded-xl bg-primarygreen-1 text-white text-lg font-bold shadow hover:bg-[#00664f] transition flex items-center gap-2"
            onClick={handleSave}
          >
            Opslaan
          </button>
        </div>
        {success && (
          <div className="absolute right-10 bottom-24 bg-green-100 border border-green-400 text-green-800 px-6 py-3 rounded-xl font-semibold shadow-lg">
            Openingsuren succesvol opgeslagen!
          </div>
        )}
      </div>
    </div>
  );
}
