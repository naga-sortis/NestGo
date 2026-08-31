import { useEffect, useState } from 'react'
import { useTrip } from '../lib/tripState'
import { fetchFeedbackSummary, submitFeedbackRemote } from '../lib/repos/feedbackRepo'
import { isSupabaseConfigured } from '../lib/supabaseClient'

export function FeedbackWidget() {
  const { state, submitFeedback } = useTrip()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [remoteSummary, setRemoteSummary] = useState<{ average: number; count: number } | null>(
    null,
  )

  useEffect(() => {
    if (!isSupabaseConfigured) return
    fetchFeedbackSummary().then(setRemoteSummary)
  }, [submitted])

  async function handleSubmit() {
    if (rating === 0) return
    submitFeedback(rating, comment)
    await submitFeedbackRemote(rating, comment)
    setSubmitted(true)
  }

  const localAverage =
    state.feedback.length > 0
      ? (state.feedback.reduce((sum, f) => sum + f.rating, 0) / state.feedback.length).toFixed(1)
      : null

  const displayAverage = remoteSummary
    ? { value: remoteSummary.average.toFixed(1), count: remoteSummary.count }
    : localAverage
      ? { value: localAverage, count: state.feedback.length }
      : null

  if (!open) {
    return (
      <div className="mx-auto mt-8 max-w-3xl text-center">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
        >
          💬 How's NestGo working for you?
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-left dark:border-slate-800 dark:bg-slate-900">
      {submitted ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Thanks — this is exactly the kind of signal we use to prioritize what to
          build next.
          {displayAverage && (
            <span className="mt-1 block text-slate-400">
              Average {isSupabaseConfigured ? 'across all users' : 'so far'}:{' '}
              {displayAverage.value}/5 ({displayAverage.count} response
              {displayAverage.count === 1 ? '' : 's'})
            </span>
          )}
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Rate your experience so far
          </p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`text-2xl ${n <= rating ? 'opacity-100' : 'opacity-30'}`}
                aria-label={`${n} star`}
              >
                ⭐
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What would make this more useful for you?"
            rows={3}
            className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="mt-3 w-full rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            Send feedback
          </button>
        </>
      )}
    </div>
  )
}
