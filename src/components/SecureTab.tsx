import { useRef, useState } from 'react'
import { useTrip } from '../lib/tripState'
import { getRequirements } from '../data/visaRequirements'
import { buildGoogleCalendarUrl } from '../lib/calendar'
import { SignaturePad } from './SignaturePad'

type UploadStep = 'idle' | 'processing' | 'done'

export function SecureTab() {
  const { state, setFormAnswer, setSignature, toggleChecklistItem, logActivity } = useTrip()
  const trip = state.trip!
  const { fields, checklist } = getRequirements(trip.destinationCountry, trip.purpose)

  const [uploadStep, setUploadStep] = useState<UploadStep>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const doneCount = checklist.filter((item) => state.checklist[item.id]).length
  const allDone = doneCount === checklist.length

  function handleFile(file: File | undefined) {
    if (!file) return
    setFileName(file.name)
    setUploadStep('processing')
    logActivity(`Uploaded document: ${file.name}`)
    setTimeout(() => {
      setUploadStep('done')
      logActivity('AI extracted document fields')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">
          {trip.destinationCountry} paperwork for your {trip.purpose} move
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Starter checklist — confirm exact requirements with{' '}
          {trip.destinationCountry}'s official immigration portal before relying on this.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-8 text-slate-500 transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-400"
        >
          <span className="text-2xl" aria-hidden="true">
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
        {uploadStep === 'processing' && (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
            Processing with NestGo AI...
          </div>
        )}
        {uploadStep === 'done' && (
          <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            Extracted. Review and complete the fields below.
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {field.label}
              </label>
              <input
                type={field.type}
                value={state.formAnswers[field.id] ?? ''}
                onChange={(e) => setFormAnswer(field.id, e.target.value)}
                onBlur={() => logActivity(`Filled in: ${field.label}`)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          ))}
        </div>

        <div className="mt-5">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Signature
          </label>
          {state.signature ? (
            <div className="mt-1 rounded-lg border border-emerald-700 bg-emerald-50 p-2 dark:bg-emerald-900/20">
              <img src={state.signature} alt="Your signature" className="h-16" />
            </div>
          ) : (
            <div className="mt-1">
              <SignaturePad onSave={setSignature} />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Arrival checklist</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {doneCount}/{checklist.length} complete
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-emerald-700 transition-all"
            style={{ width: `${(doneCount / checklist.length) * 100}%` }}
          />
        </div>

        <ul className="mt-4 space-y-2">
          {checklist.map((item) => {
            const done = !!state.checklist[item.id]
            const calendarUrl = buildGoogleCalendarUrl(
              `NestGo: ${item.label}`,
              `Reminder generated by NestGo for your ${trip.purpose} move to ${trip.destinationCity}, ${trip.destinationCountry}.`,
            )
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
              >
                <button
                  type="button"
                  onClick={() => toggleChecklistItem(item.id, item.label)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    done
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {done ? '✓' : ''}
                </button>
                <span className={`flex-1 ${done ? 'text-slate-400 line-through' : ''}`}>
                  {item.label}
                </span>
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => logActivity(`Set Google Calendar reminder: ${item.label}`)}
                  className="shrink-0 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
                >
                  📅 Remind me
                </a>
              </li>
            )
          })}
        </ul>

        {allDone && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            All done — head to the Settle tab to find housing.
          </p>
        )}
      </div>
    </div>
  )
}
