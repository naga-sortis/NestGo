import { useRef, useState } from 'react'

type Step = 'idle' | 'processing' | 'done'

type ChecklistItem = {
  id: string
  label: string
  done: boolean
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'empadronamiento', label: 'Empadronamiento (city registration)', done: false },
  { id: 'cita', label: 'Cita Previa request', done: false },
  { id: 'tie', label: 'TIE / NIE application', done: false },
]

export function SecureTab() {
  const [step, setStep] = useState<Step>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | undefined) {
    if (!file) return
    setFileName(file.name)
    setStep('processing')
    // Concierge-mock delay standing in for a real Claude/OpenAI extraction
    // call — see README "Wiring a real AI backend" for how to swap this.
    setTimeout(() => {
      setStep('done')
      setChecklist((prev) =>
        prev.map((item, i) => (i === 0 ? { ...item, done: true } : item)),
      )
    }, 2200)
  }

  function toggleItem(id: string) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">AI document assistant</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Drop a passport or work contract — NestGo extracts the fields your
          local paperwork needs.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-10 text-slate-500 transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-400"
        >
          <span className="text-3xl" aria-hidden="true">
            📄
          </span>
          <span className="text-sm font-medium">
            {fileName ?? 'Upload passport or contract (PDF/JPG)'}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {step === 'processing' && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
            Processing with NestGo AI...
          </div>
        )}

        {step === 'done' && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            <p className="font-medium">
              AI verification complete. Your Spanish EX-15 form has been
              generated.
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-emerald-900/80 dark:text-emerald-200/80">
              <dt>Full name</dt>
              <dd>Extracted from document</dd>
              <dt>Passport number</dt>
              <dd>•••• redacted</dd>
              <dt>Nationality</dt>
              <dd>Detected automatically</dd>
              <dt>Form</dt>
              <dd>EX-15 pre-filled</dd>
            </dl>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Madrid arrival checklist</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track the three steps every new arrival needs, in order.
        </p>
        <ul className="mt-5 space-y-3">
          {checklist.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm hover:border-emerald-600 dark:border-slate-800"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    item.done
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {item.done ? '✓' : ''}
                </span>
                <span className={item.done ? 'line-through text-slate-400' : ''}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
