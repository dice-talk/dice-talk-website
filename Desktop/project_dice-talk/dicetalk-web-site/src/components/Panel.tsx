
export function Panel({
  title,
  items,
  className = '',
  heightClass = 'text-sm text-gray-700 space-y-1',
}: {
  title: string;
  items: string[];
  className?: string;
  heightClass?: string;
}) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow ${className}`}>
      <h2 className="font-semibold mb-2">{title}</h2>
      <ul className={heightClass}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}