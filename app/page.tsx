import ReferralSubmissionForm from '../components/ReferralSubmissionForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Teed.ai
        </h1>
        <ReferralSubmissionForm />
      </div>
    </main>
  )
}