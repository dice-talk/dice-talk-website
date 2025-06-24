interface PanelProps {
  title: string;
  items: React.ReactNode[]; // string[]에서 React.ReactNode[]로 변경
  className?: string;
} 

export function Panel({ title, items, className = ''} : PanelProps) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow ${className}`}>
      <h2 className="text-xl font-bold mb-2 text-customTitle">{title}</h2> {/* 제목 글자 두께 강조 */}
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}