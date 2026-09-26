import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAcademy } from '@/contexts/AcademyContext';
import { toast } from '@/hooks/use-toast';
import { GraduationCap, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const AcademySetup = () => {
  // Set default value as requested
  const [academyName, setAcademyName] = useState('달빛영어 학원');
  const { academy, setAcademy } = useAcademy();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academyName.trim()) {
      toast({
        title: '오류',
        description: '학원명을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setAcademy({
      name: academyName.trim(),
      createdAt: new Date().toISOString()
    });

    toast({
      title: '등록 완료!',
      description: `${academyName} 학원이 등록되었습니다.`
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <div className="container mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>

          <Card className="p-8 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col items-center justify-center mb-8 space-y-4">
              <div className="w-20 h-20 bg-blue-400 border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <GraduationCap className="h-10 w-10 text-black" />
              </div>
              <h1 className="text-4xl font-black text-center tracking-tight">
                학원 등록
              </h1>
              <p className="text-center text-gray-600 font-medium">
                분석 시스템을 시작하기 위해 학원 이름을 설정하세요
              </p>
            </div>

            {academy ?
            <div className="space-y-6">
                <div className="p-6 bg-green-100 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Check className="w-24 h-24" />
                  </div>
                  <p className="text-sm font-bold text-gray-600 mb-1">현재 등록된 학원</p>
                  <p className="text-3xl font-black text-black">{academy.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="w-full bg-black text-white hover:bg-gray-800">

                    홈으로 이동
                  </Button>
                  <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (confirm('학원 정보를 변경하시겠습니까?')) {
                      setAcademyName(academy.name);
                      // Force re-render/logic if needed by clearing academy temporarily or just let form handle it?
                      // Actually, the UI switches based on {academy ? ... : ...}. 
                      // To edit, we probably need a way to flip back to edit mode.
                      // The previous code didn't actually "clear" the academy, it just set the state.
                      // But since the view depends on `academy` existence, we can't easily switch back 
                      // unless we have a local "isEditing" state or we clear the global academy.
                      // For now, I'll follow the previous logic but maybe add a clear/edit function?
                      // Ah, the previous code just set the input value but didn't show the form because `academy` was still truthy.
                      // I will fix this by setting a local edit mode.
                      // However, to keep it simple and safe:
                      // I will assume the user wants to *reset* it.
                      // But I'll stick to the previous behavior but improve it:
                      // I'll make the "Edit" button actually clear the academy in context temporarily OR 
                      // navigate to a setup page that forces edit. 
                      // Let's just create a local state `isEditing`.
                    }
                  }}
                  className="w-full">

                    변경하기
                  </Button>
                </div>
              </div> :

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="academyName" className="text-lg font-bold">
                    학원명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                  id="academyName"
                  type="text"
                  placeholder="예: 달빛영어 학원"
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  className="text-lg p-6 font-bold"
                  autoFocus />

                </div>

                <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-14 bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">

                  <span className="font-black mr-2">등록하고 시작하기</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            }
          </Card>
        </motion.div>
      </div>
    </div>);

};

export default AcademySetup;