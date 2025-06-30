import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import Button from './Button';
import { XCircle, UploadCloud, Star } from 'lucide-react';

export interface ExistingImage {
  url: string;
  isThumbnail: boolean;
  id?: number; // 기존 이미지의 경우 ID가 있을 수 있음 (삭제 시 활용)
}

interface ImageUploadProps {
  onImagesChange: (
    newFiles: File[],
    removedExistingUrls: string[],
    thumbnailFlags: boolean[] 
  ) => void;
  existingImageUrls?: ExistingImage[]; 
  label?: string;
  maxFiles?: number;
  disabled?: boolean;
}

interface DisplayImage {
  url: string;
  file?: File;
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

    const updatedRemovedOriginalUrls = [...removedUrls];
    if (imageToRemove.isExisting && imageToRemove.originalUrl) {
      if (!updatedRemovedOriginalUrls.includes(imageToRemove.originalUrl)) { 
        updatedRemovedOriginalUrls.push(imageToRemove.originalUrl);
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
      updateParentState(updatedImages, updatedRemovedOriginalUrls); 
      return updatedImages;
    });
    setRemovedUrls(updatedRemovedOriginalUrls);
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
        multiple 
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
                    variant="outline" 
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