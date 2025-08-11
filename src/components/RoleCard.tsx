export default function RoleCard({ role, preview, onViewFull }: { role: string; preview: string[]; onViewFull: () => void }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
      <h2 className="text-xl font-semibold mb-4 text-indigo-400">{role}</h2>
      <ul className="text-gray-300 text-sm list-disc pl-5 space-y-1">
        {preview.map((q, i) => <li key={i}>{q}</li>)}
      </ul>
      <button
        onClick={onViewFull}
        className="mt-4 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition"
      >
        View Full
      </button>
    </div>
  );
}
