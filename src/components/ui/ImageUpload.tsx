import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import Button from './Button'; // Button 컴포넌트 경로 확인
import { XCircle, UploadCloud, Star } from 'lucide-react';

export interface ExistingImage {
  url: string;
  isThumbnail: boolean;
  id?: number; // 기존 이미지의 경우 ID가 있을 수 있음 (삭제 시 활용)
}

interface ImageUploadProps {
  onImagesChange: (
    newFiles: File[],
    removedExistingUrls: string[], // 제거된 기존 이미지의 URL 목록
    thumbnailFlags: boolean[] // 현재 표시되는 모든 이미지(기존+새로운)에 대한 썸네일 플래그
  ) => void;
  existingImageUrls?: ExistingImage[]; // 기존 이미지 정보 (URL과 초기 썸네일 상태 포함)
  label?: string;
  maxFiles?: number;
  disabled?: boolean;
}

interface DisplayImage {
  url: string; // Blob URL 또는 기존 이미지 URL
  file?: File; // 새로 추가된 파일인 경우 File 객체
  isExisting: boolean; // 기존 이미지인지 여부
  originalUrl?: string; // 기존 이미지인 경우 원래 URL (제거 시 사용)
  isThumbnail: boolean;
}

export function ImageUpload({
  onImagesChange,
  existingImageUrls = [],
  label = "이미지 업로드",
  maxFiles = 5,
  disabled = false
}: ImageUploadProps) {
  const [displayImages, setDisplayImages] = useState<DisplayImage[]>([]);
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialDisplayImages: DisplayImage[] = existingImageUrls.map(img => ({
      url: img.url,
      isExisting: true,
      originalUrl: img.url,
      isThumbnail: img.isThumbnail,
    }));
    setDisplayImages(initialDisplayImages);
    setRemovedUrls([]);
    // 다음 onImagesChange 호출은 제거합니다. NoticeForm에서 초기 상태를 관리합니다.
    // existingImageUrls가 변경될 때 (컴포넌트 마운트 또는 prop 변경 시)
    // 초기 이미지 목록과 썸네일 상태를 부모에게 전달합니다.
    // 이 시점에는 새로 추가된 파일이나 제거된 기존 URL은 없습니다.
    // const initialNewFiles: File[] = [];
    // const initialRemovedUrls: string[] = [];
    // onImagesChange(initialNewFiles, initialRemovedUrls, initialDisplayImages.map(img => img.isThumbnail));
  }, [existingImageUrls]);

  const updateParentState = (currentDisplayImages: DisplayImage[], currentRemovedUrls: string[]) => {
    const newFiles = currentDisplayImages.filter(img => img.file).map(img => img.file!);
    const thumbnailFlags = currentDisplayImages.map(img => img.isThumbnail);
    onImagesChange(newFiles, currentRemovedUrls, thumbnailFlags);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const availableSlots = maxFiles - displayImages.length;
    const filesToProcess = selectedFiles.slice(0, availableSlots);

    const newDisplayImagesData: DisplayImage[] = filesToProcess.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      isExisting: false,
      isThumbnail: false,
    }));

    setDisplayImages(prevImages => {
      const updatedImages = [...prevImages, ...newDisplayImagesData];
      if (updatedImages.length > 0 && !updatedImages.some(img => img.isThumbnail)) {
        updatedImages[0].isThumbnail = true;
      }
      // updateParentState 호출 시 removedUrls의 최신 상태를 직접 전달하거나,
      // setDisplayImages의 콜백 함수 내에서 removedUrls 상태를 참조하지 않도록 합니다.
      // 여기서는 현재 로직상 removedUrls가 파일 추가 시에는 변경되지 않으므로 기존 상태를 사용해도 무방합니다.
      updateParentState(updatedImages, removedUrls); 
      return updatedImages;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const imageToRemove = displayImages.find(img => img.url === urlToRemove);
    if (!imageToRemove) return;

    const updatedRemovedOriginalUrls = [...removedUrls]; // 상태 업데이트에 사용될 로컬 변수
    if (imageToRemove.isExisting && imageToRemove.originalUrl) {
      if (!updatedRemovedOriginalUrls.includes(imageToRemove.originalUrl)) { // 'newRemovedUrls'를 'updatedRemovedOriginalUrls'로 수정
        updatedRemovedOriginalUrls.push(imageToRemove.originalUrl); // push 사용
      }
    }

    if (!imageToRemove.isExisting) {
      URL.revokeObjectURL(urlToRemove);
    }

    setDisplayImages(prevImages => {
      const updatedImages = prevImages.filter(img => img.url !== urlToRemove);
      if (imageToRemove.isThumbnail && updatedImages.length > 0 && !updatedImages.some(img => img.isThumbnail)) {
        updatedImages[0].isThumbnail = true;
      }
      updateParentState(updatedImages, updatedRemovedOriginalUrls); // 업데이트된 removed URL 목록 전달
      return updatedImages;
    });
    setRemovedUrls(updatedRemovedOriginalUrls); // 상태 업데이트
  };

  const handleSetThumbnail = (urlToSet: string) => {
    setDisplayImages(prevImages => {
      const updatedImages = prevImages.map(img => ({
        ...img,
        isThumbnail: img.url === urlToSet,
      }));
      updateParentState(updatedImages, removedUrls);
      return updatedImages;
    });
  };

  const triggerFileInput = () => {
    if (displayImages.length < maxFiles) {
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
        {displayImages.map((img, index) => (
          <div key={img.url} className="relative group aspect-square border rounded-md overflow-hidden">
            <img src={img.url} alt={`Preview ${index + 1}`} className="object-cover w-full h-full" />
            {!disabled && (
              <>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveImage(img.url)} className="absolute top-1 right-1 bg-black/50 text-white hover:bg-black/70 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`이미지 ${index + 1} 제거`}> 
                  <XCircle size={18} /> 
                </Button>
                {img.isThumbnail ? (
                  <div className="absolute bottom-1 left-1 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                    대표
                  </div>
                ) : (
                  <Button
                    variant="outline" // 'ghost'에서 변경하여 항상 보이도록
                    size="sm"
                    onClick={() => handleSetThumbnail(img.url)}
                    className="absolute bottom-1 left-1 bg-white/80 hover:bg-white text-gray-700 hover:text-indigo-600 border-gray-300 hover:border-indigo-500 px-2 py-1 rounded-md text-xs flex items-center" // 스타일 수정
                    aria-label={`이미지 ${index + 1} 대표로 설정`}
                  >
                    <Star size={14} className="mr-1" fill="none" /> 대표로 설정
                  </Button>
                )}
              </>
            )}
          </div>
        ))}
        {displayImages.length < maxFiles && !disabled && (
          <Button type="button" variant="outline" onClick={triggerFileInput} className="w-full aspect-square border-dashed border-gray-400 hover:border-gray-500 text-gray-600 flex flex-col items-center justify-center p-2">
            <UploadCloud size={24} className="mb-1 text-gray-500" />
            <span className="text-xs text-center">이미지 추가 ({displayImages.length}/{maxFiles})</span>
          </Button>
        )}
      </div>
    </div>
  );
}