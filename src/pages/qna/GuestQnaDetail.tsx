import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/Header";
import { ImageUpload } from "../../components/ui/ImageUpload";
import { getQuestion } from "../../api/questionApi";
import { postAnswer, patchAnswer } from "../../api/answerApi";
import type { QuestionResponse } from "../../types/questionTypes";
import type {
  AnswerPostRequest,
  AnswerPatchRequest,
} from "../../types/answerTypes";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function GuestQnaDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [qnaItem, setQnaItem] = useState<QuestionResponse | null>(null);
  const [answerImageFiles, setAnswerImageFiles] = useState<File[]>([]);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (questionId) {
      getQuestion(Number(questionId))
        .then((res) => {
          console.log("비회원 문의 상세 응답:", res.data.data);
          setQnaItem(res.data.data);
          if (res.data.data.answer?.content) {
            setAnswer(res.data.data.answer.content);
            setIsEditingAnswer(false);
            setIsAnswerFormOpen(false);
          }
        })
        .catch(() => {
          alert("비회원 문의를 불러오지 못했습니다.");
        });
    }
  }, [questionId]);

  const handleSave = async () => {
    if (!qnaItem) return;
    if (answer.trim() === "") {
      alert("답변 내용은 필수입니다.");
      return;
    }
    const isEdit = isEditingAnswer && qnaItem.answer;
    let answerDto: AnswerPostRequest | AnswerPatchRequest;
    if (isEdit) {
      const keepImageIds =
        qnaItem.answer?.answerImages
          .filter((img) => !removedImageUrls.includes(img.imageUrl))
          .map((img) => img.answerImageId) || [];
      answerDto = {
        answerPatchDtoString: JSON.stringify({ content: answer, keepImageIds }),
        images: answerImageFiles,
        keepImageIds,
      };
    } else {
      answerDto = {
        answerPostDtoString: JSON.stringify({ content: answer }),
        images: answerImageFiles,
      };
    }
    try {
      if (isEdit) {
        await patchAnswer(
          qnaItem.questionId,
          qnaItem.answer!.answerId,
          answerDto as AnswerPatchRequest,
          answerImageFiles
        );
      } else {
        await postAnswer(
          qnaItem.questionId,
          answerDto as AnswerPostRequest,
          answerImageFiles
        );
      }
      alert("답변이 저장되었습니다.");
      setAnswerImageFiles([]);
      setRemovedImageUrls([]);
      setIsEditingAnswer(false);
      setIsAnswerFormOpen(false);
      const res = await getQuestion(qnaItem.questionId);
      setQnaItem(res.data.data);
      if (res.data.data.answer?.content) {
        setAnswer(res.data.data.answer.content);
      } else {
        setAnswer("");
      }
    } catch {
      alert("답변 저장에 실패했습니다.");
    }
  };

  const handleOpenAnswerForm = () => {
    setIsAnswerFormOpen(true);
    setIsEditingAnswer(false);
    setAnswer("");
    setAnswerImageFiles([]);
  };

  const handleEditAnswer = () => {
    setIsEditingAnswer(true);
    setIsAnswerFormOpen(true);
    if (qnaItem) {
      setAnswer(qnaItem.answer?.content || "");
      setAnswerImageFiles([]);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAnswer(false);
    setIsAnswerFormOpen(false);
    if (qnaItem) {
      setAnswer(qnaItem.answer?.content || "");
    }
  };

  const handleDeleteAnswer = () => {
    if (window.confirm("답변을 정말 삭제하시겠습니까?")) {
      if (qnaItem) {
        setQnaItem({
          ...qnaItem,
          answer: undefined,
        });
        setAnswer("");
        setIsEditingAnswer(false);
        setIsAnswerFormOpen(false);
        alert("답변이 삭제되었습니다.");
      }
    }
  };

  const handleAnswerImageChange = (files: File[], removedUrls: string[]) => {
    setAnswerImageFiles(files);
    setRemovedImageUrls(removedUrls);
  };

  const handleListButton = () => {
    navigate(-1);
  };

  if (!qnaItem) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <p>비회원 문의를 불러오는 중이거나 찾을 수 없습니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-300 to-purple-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 rounded-tl-xl overflow-y-auto space-y-8">
          {/* 문의 섹션 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {qnaItem.title}
              </h2>
              <span className="text-sm text-gray-500">
                등록일: {formatDate(qnaItem.createdAt)}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1 mb-4">
              <span>이메일: {qnaItem.email}</span>
            </div>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
              {qnaItem.content}
            </div>
            {qnaItem.questionImages && qnaItem.questionImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  첨부 이미지
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {qnaItem.questionImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.imageUrl}
                      alt={`Question attachment ${index + 1}`}
                      className="rounded-md border aspect-square object-cover w-full h-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 답변 섹션 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            {qnaItem.answer && !isAnswerFormOpen && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    답변 내용
                  </h3>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditAnswer}
                    >
                      답변 수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={handleDeleteAnswer}
                    >
                      답변 삭제
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-gray-700 whitespace-pre-wrap">
                  {String(qnaItem.answer.content ?? "")}
                </div>
                {qnaItem.answer.answerImages &&
                  qnaItem.answer.answerImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">
                        첨부된 답변 이미지
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {qnaItem.answer.answerImages.map((img, index) => (
                          <img
                            key={index}
                            src={img.imageUrl}
                            alt={`Answer attachment ${index + 1}`}
                            className="rounded-md border aspect-square object-cover w-full h-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                <div className="flex justify-end mt-6">
                  <Button variant="outline" onClick={handleListButton}>
                    목록으로
                  </Button>
                </div>
              </div>
            )}
            {!qnaItem.answer && !isAnswerFormOpen && (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-600 mb-4">
                  아직 답변이 등록되지 않았습니다. 관리자가 확인 후 답변을 드릴
                  예정입니다.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleOpenAnswerForm}
                >
                  답변 등록
                </Button>
              </div>
            )}
            {isAnswerFormOpen && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {isEditingAnswer ? "답변 수정" : "답변 작성"}
                </h3>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full min-h-[150px] border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="답변을 입력하세요..."
                />
                <div className="mt-4">
                  <ImageUpload
                    onImagesChange={handleAnswerImageChange}
                    existingImageUrls={
                      isEditingAnswer
                        ? qnaItem.answer?.answerImages?.map(
                            (img) => img.imageUrl
                          ) || []
                        : []
                    }
                    maxFiles={5}
                    label="답변 이미지 첨부 (선택 사항)"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={handleListButton}>
                    목록으로
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    취소
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSave}
                  >
                    {isEditingAnswer ? "답변 수정 완료" : "답변 저장"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
