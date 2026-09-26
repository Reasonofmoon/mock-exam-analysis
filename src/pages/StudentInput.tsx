import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAcademy } from '@/contexts/AcademyContext';
import { toast } from '@/hooks/use-toast';
import { StudentExam } from '@/types/exam';
import { calculateScore, getGradeLevel } from '@/lib/scoreCalculator';
import { UserPlus, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentInput = () => {
  const { academy, addStudent } = useAcademy();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('');
  const [examRound, setExamRound] = useState('');
  const [questions, setQuestions] = useState<boolean[]>(Array(45).fill(false));
  const [threePointQuestions, setThreePointQuestions] = useState<number[]>([]);

  if (!academy) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full bg-white">
          <p className="text-xl font-bold mb-6 border-b-2 border-black pb-4">먼저 학원을 등록해주세요.</p>
          <Button onClick={() => navigate('/academy')} className="w-full">학원 등록하기</Button>
        </Card>
      </div>);
  }

  const handleQuestionToggle = (index: number) => {
    const updated = [...questions];
    updated[index] = !updated[index];
    setQuestions(updated);
  };

  const handleThreePointToggle = (index: number) => {
    setThreePointQuestions((prev) =>
    prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !grade.trim() || !examRound.trim()) {
      toast({
        title: '오류',
        description: '모든 필수 항목을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    const calculatedScore = calculateScore(questions, threePointQuestions);
    const gradeLevel = getGradeLevel(calculatedScore);

    const newStudent: StudentExam = {
      id: Date.now().toString(),
      academyName: academy.name,
      studentName: studentName.trim(),
      grade: grade.trim(),
      examRound: examRound.trim(),
      actualScore: calculatedScore,
      questions,
      threePointQuestions,
      calculatedScore,
      gradeLevel,
      createdAt: new Date().toISOString()
    };

    addStudent(newStudent);

    toast({
      title: '추가 완료',
      description: `${studentName} 학생이 추가되었습니다. (점수: ${calculatedScore}점, ${gradeLevel})`
    });

    setStudentName('');
    setQuestions(Array(45).fill(false));
    // Keep grade and examRound for convenience
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>

          <Card className="p-0 bg-white overflow-hidden">
             <div className="p-8 border-b-2 border-black bg-blue-400">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center">
                    <UserPlus className="h-8 w-8 text-black" />
                  </div>
                </div>
                <h1 className="text-4xl font-black text-center text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                  학생 데이터 입력
                </h1>
                <p className="text-center text-white font-bold mt-2">
                  학생 정보와 답안을 입력하세요
                </p>
             </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="studentName" className="font-bold text-base">
                      학생 이름
                    </Label>
                    <Input
                      id="studentName"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="홍길동"
                      className="text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade" className="font-bold text-base">
                      학년
                    </Label>
                    <Input
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="고3"
                      className="text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examRound" className="font-bold text-base">
                      모의고사 회차
                    </Label>
                    <Input
                      id="examRound"
                      value={examRound}
                      onChange={(e) => setExamRound(e.target.value)}
                      placeholder="2024-03"
                      className="text-lg" />
                  </div>
                </div>

                <div className="space-y-4 border-2 border-black p-6 rounded-lg bg-gray-50">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <Label className="text-xl font-black">문항별 답안 (45문항)</Label>
                    <div className="flex items-center space-x-4 text-sm font-bold">
                      <div className="flex items-center space-x-2 bg-white px-3 py-1 border-2 border-black rounded-full">
                        <div className="w-4 h-4 bg-green-500 border border-black rounded-full"></div>
                        <span>정답</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-3 py-1 border-2 border-black rounded-full">
                        <div className="w-4 h-4 bg-red-100 border border-black rounded-full"></div>
                        <span>오답</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-3 py-1 border-2 border-black rounded-full">
                        <div className="w-4 h-4 bg-purple-500 border border-black rounded-full"></div>
                        <span>3점</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-3">
                    {questions.map((isCorrect, index) => {
                      const is3Point = threePointQuestions.includes(index);
                      return (
                        <div key={index} className="space-y-1">
                          <button
                            type="button"
                            className={`w-full h-10 border-2 border-black rounded font-bold text-sm transition-all active:translate-y-1 flex items-center justify-center ${
                            isCorrect ?
                            'bg-green-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' :
                            'bg-white hover:bg-red-50 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`
                            }
                            onClick={() => handleQuestionToggle(index)}>
                            <span className="mr-1">{index + 1}</span>
                            {isCorrect ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </button>
                          
                          <button
                            type="button"
                            className={`w-full text-[10px] h-6 border-2 border-black rounded font-bold transition-all active:translate-y-1 ${
                            is3Point ?
                            'bg-purple-500 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' :
                            'bg-gray-100 text-gray-400 border-gray-300 hover:border-black hover:text-black'}`
                            }
                            onClick={() => handleThreePointToggle(index)}>
                            {is3Point ? '3pt' : '2pt'}
                          </button>
                        </div>);
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-black text-white hover:bg-gray-800 text-lg h-14">
                    학생 추가
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-14"
                    onClick={() => navigate('/dashboard')}>
                    대시보드로 이동
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>);
};

export default StudentInput;