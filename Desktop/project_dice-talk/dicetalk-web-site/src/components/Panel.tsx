interface PanelProps {
  title: string;
  items: string[];
  className?: string;
}

export function Panel({ title, items, className = ''} : PanelProps) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow ${className}`}>
      <h2 className="text-xl font-semibold mb-2 text-customTitle">{title}</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}