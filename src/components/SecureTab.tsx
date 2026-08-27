import { useRef, useState } from 'react'
import { useTrip } from '../lib/tripState'
import { getRequirements } from '../data/visaRequirements'
import { downloadTextFile } from '../lib/download'
import { buildCaseSummaryHtml } from '../lib/exportCase'
import { SignaturePad } from './SignaturePad'
import { ChecklistItemRow } from './ChecklistItemRow'

type UploadStep = 'idle' | 'processing' | 'done'

// Stand-in for a real OCR/AI extraction call — fills in plausible values so
// the auto-fill behavior is visible and editable. Swap for a real backend
// call (see README) to extract these from the actual uploaded document.
function mockExtractedIdentity() {
  return {
    fullName: 'Jordan A. Traveler',
    passportNumber: 'X1234567',
    nationality: 'Detected from document',
    arrivalDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  }
}

export function SecureTab() {
  const { state, setFormAnswer, setSignature, logActivity } = useTrip()
  const trip = state.trip!
  const { baseFields, checklist } = getRequirements(trip.destinationCountry, trip.purpose)

  const [uploadStep, setUploadStep] = useState<UploadStep>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const doneCount = checklist.filter((item) => state.checklist[item.id]).length
  const allDone = doneCount === checklist.length
  const hasCaseData = Object.keys(state.formAnswers).length > 0 || !!state.signature

  function handleFile(file: File | undefined) {
    if (!file) return
    setFileName(file.name)
    setUploadStep('processing')
    logActivity(`Uploaded document: ${file.name}`)
    setTimeout(() => {
      const extracted = mockExtractedIdentity()
      Object.entries(extracted).forEach(([id, value]) => setFormAnswer(id, value))
      setUploadStep('done')
      logActivity('AI extracted identity fields from document (review before relying on them)')
    }, 2000)
  }

  function handleDownload() {
    const html = buildCaseSummaryHtml({
      trip,
      baseFields,
      checklist,
      formAnswers: state.formAnswers,
      checklistState: state.checklist,
      signature: state.signature,
    })
    downloadTextFile(`nestgo-case-${trip.destinationCity.toLowerCase()}.html`, html)
    logActivity('Downloaded case summary')
  }

  function buildMailto() {
    const subject = `My NestGo case — ${trip.destinationCity}`
    const body = [
      `${trip.originCity}, ${trip.originCountry} -> ${trip.destinationCity}, ${trip.destinationCountry} (${trip.purpose})`,
      '',
      `Checklist: ${doneCount}/${checklist.length} complete`,
      '',
      "I've attached my downloaded NestGo case summary (download it first, then attach the file to this email).",
    ].join('\n')
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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
            Extracted below — review and correct before it's used on any form.
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {baseFields.map((field) => (
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

        {hasCaseData && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
            >
              📥 Download my forms
            </button>
            <a
              href={buildMailto()}
              onClick={() => logActivity('Opened email client to send case summary')}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
            >
              ✉️ Email me a copy
            </a>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Arrival checklist</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {doneCount}/{checklist.length} complete
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Tap an item to see instructions, fill its specific form fields, or find the
          right office/portal.
        </p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-emerald-700 transition-all"
            style={{ width: `${(doneCount / checklist.length) * 100}%` }}
          />
        </div>

        <ul className="mt-4 space-y-2">
          {checklist.map((item) => (
            <ChecklistItemRow key={item.id} item={item} />
          ))}
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
