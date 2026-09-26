import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAcademy } from '@/contexts/AcademyContext';
import { toast } from '@/hooks/use-toast';
import { parseCSV } from '@/lib/csvParser';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CSVImport = () => {
  const { academy, addStudents } = useAcademy();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);

    try {
      const text = await file.text();
      const students = parseCSV(text);

      if (students.length === 0) {
        throw new Error('CSV 파일에서 학생 데이터를 찾을 수 없습니다.');
      }

      addStudents(students);

      toast({
        title: '업로드 완료',
        description: `${students.length}명의 학생 데이터가 추가되었습니다.`
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast({
        title: '업로드 실패',
        description: error instanceof Error ? error.message : '파일을 처리하는 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [addStudents, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  if (!academy) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-black mx-auto mb-4" />
          <p className="text-xl font-bold mb-4">먼저 학원을 등록해주세요.</p>
          <Button onClick={() => navigate('/academy')} className="w-full">학원 등록하기</Button>
        </Card>
      </div>);
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>

          <Card className="bg-white overflow-hidden p-0">
             <div className="p-8 border-b-2 border-black bg-pink-400">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-black" />
                  </div>
                </div>

                <h1 className="text-4xl font-black text-center text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wider mb-2">
                  CSV 파일 업로드
                </h1>
                <p className="text-center text-white font-bold">
                  학생 데이터가 포함된 CSV 파일을 업로드하세요
                </p>
             </div>

            <div className="p-8">
              <div
                {...getRootProps()}
                className={`border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ?
                'border-blue-500 bg-blue-50 scale-[1.02]' :
                'border-black hover:bg-gray-50 hover:border-blue-500'} ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>

                <input {...getInputProps()} />
                
                {isProcessing ?
                <div className="space-y-4">
                    <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-xl font-bold text-black">파일 처리 중...</p>
                  </div> :

                <div className="space-y-4">
                    <FileText className="h-20 w-20 text-black mx-auto stroke-[1.5]" />
                    {isDragActive ?
                  <p className="text-2xl font-black text-blue-600">파일을 여기에 놓으세요!</p> :
                  <>
                        <p className="text-2xl font-black text-black">
                          CSV 파일을 드래그하거나 클릭하여 업로드
                        </p>
                        <p className="text-lg font-medium text-gray-500">
                          .csv 파일만 지원됩니다
                        </p>
                      </>
                  }
                  </div>
                }
              </div>

              <div className="mt-8 p-6 bg-blue-50 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black mb-3 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                  CSV 파일 형식 안내
                </h3>
                <ul className="space-y-2 text-sm text-black font-medium">
                  <li>• <strong>필수 컬럼:</strong> 학원명, 이름, 학년, 모의고사 회차, 실제점수</li>
                  <li>• <strong>문항 컬럼:</strong> 45개 문항의 O/X 결과</li>
                  <li>• <strong>3점 문항 표시:</strong> 컬럼명에 "3점", "[3점]", "(3점)", "3pt" 포함</li>
                  <li>• <strong>예시:</strong> 학원명,이름,학년,모의고사 회차,실제점수,1번,2번(3점),3번,...</li>
                </ul>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/student-input')}
                  className="flex-1 h-12 text-lg">
                  수동으로 입력하기
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-black text-white hover:bg-gray-800 h-12 text-lg">
                  대시보드로 이동
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>);
};

export default CSVImport;