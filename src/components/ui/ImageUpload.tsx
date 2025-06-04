import { useState, useRef, type ChangeEvent  } from 'react';
import Button from './Button'; // Button 컴포넌트 경로 확인
import { XCircle, UploadCloud } from 'lucide-react';

interface ImageUploadProps {
  // 변경된 파일 목록과 제거된 기존 URL 목록을 함께 전달
  onImagesChange: (newFiles: File[], removedExistingUrls: string[]) => void; 
  existingImageUrls?: string[];
  label?: string;
  maxFiles?: number;
  disabled?: boolean;
}

export function ImageUpload({
  onImagesChange,
  existingImageUrls = [],
  label = "이미지 업로드",
  maxFiles = 5,
  disabled = false
}: ImageUploadProps) {
  // 표시될 모든 이미지 URL (기존 URL + 새로 추가된 파일의 Blob URL)
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>(existingImageUrls);
  // 사용자가 새로 추가한 File 객체들
  const [newlyAddedFiles, setNewlyAddedFiles] = useState<File[]>([]);
  // 사용자가 제거한 기존 이미지 URL 목록
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const filesToProcess = selectedFiles.slice(0, maxFiles - (currentImageUrls.length - removedUrls.filter(url => currentImageUrls.includes(url)).length) - newlyAddedFiles.length);

    const newBlobUrls = filesToProcess.map(file => URL.createObjectURL(file));
    const updatedNewlyAddedFiles = [...newlyAddedFiles, ...filesToProcess];
    
    setCurrentImageUrls(prevUrls => [...prevUrls, ...newBlobUrls].slice(0, maxFiles));
    setNewlyAddedFiles(updatedNewlyAddedFiles);
    onImagesChange(updatedNewlyAddedFiles, removedUrls);

    if (fileInputRef.current) { // 파일 입력 초기화하여 같은 파일 재선택 가능하게
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const isExistingUrl = existingImageUrls.includes(urlToRemove);
    let updatedNewlyAddedFiles = newlyAddedFiles;
    let updatedRemovedUrls = removedUrls;

    if (isExistingUrl) {
      if (!removedUrls.includes(urlToRemove)) {
        updatedRemovedUrls = [...removedUrls, urlToRemove];
      }
    } else { // Blob URL (새로 추가된 파일)
      const fileIndexToRemove = newlyAddedFiles.findIndex(file => URL.createObjectURL(file) === urlToRemove);
      if (fileIndexToRemove > -1) {
        updatedNewlyAddedFiles = newlyAddedFiles.filter((_, i) => i !== fileIndexToRemove);
        URL.revokeObjectURL(urlToRemove); // 메모리 해제
      }
    }
    
    setCurrentImageUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
    setNewlyAddedFiles(updatedNewlyAddedFiles);
    setRemovedUrls(updatedRemovedUrls);
    onImagesChange(updatedNewlyAddedFiles, updatedRemovedUrls);
  };

  const triggerFileInput = () => {
    // 현재 표시된 이미지 수 (기존 이미지 중 제거되지 않은 것 + 새로 추가된 것)
    const displayedImageCount = currentImageUrls.length;
    if (displayedImageCount < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <input
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleFileChange}
        multiple // 여러 파일 선택 가능하도록
        ref={fileInputRef}
        className="hidden"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {currentImageUrls.map((url, index) => (
          <div key={url} className="relative group aspect-square"> {/* key를 url로 변경하여 안정성 확보 */}
            <img src={url} alt={`Preview ${index + 1}`} className="rounded-md border object-cover w-full h-full" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveImage(url)}
              className="absolute top-1 right-1 bg-black/50 text-white hover:bg-black/70 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`이미지 ${index + 1} 제거`}
            >
              <XCircle size={18} />
            </Button>
          </div>
        ))}
        {currentImageUrls.length < maxFiles && (
          <Button type="button" variant="outline" onClick={triggerFileInput} className="w-full aspect-square border-dashed border-gray-400 hover:border-gray-500 text-gray-600 flex flex-col items-center justify-center p-2"> {/* type="button" 추가 */}
            <UploadCloud size={24} className="mb-1 text-gray-500" />
            <span className="text-xs text-center">이미지 추가 ({currentImageUrls.length}/{maxFiles})</span>
          </Button>
        )}
      </div>
    </div>
  );
}