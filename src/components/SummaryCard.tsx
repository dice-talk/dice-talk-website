
interface SummaryCardProps {
  title: string;
  value: string;
  selected?: boolean; 
  onClick?: () => void;
  className?: string; // ⬅️ 이 줄을 추가
} 

export function SummaryCard({ title, value, selected, onClick, className ='',
 }: SummaryCardProps) { 

  return (
   <div
      onClick={onClick}
      className={`p-4 w-28 sm:w-32 md:w-36 text-center cursor-pointer transition-all
        ${selected ? 'bg-blue-100 text-blue-600 font-bold rounded-lg' : ''}
        ${className}`}
    >
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}