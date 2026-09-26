import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAcademy } from '@/contexts/AcademyContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Award, Target, AlertCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { academy, students } = useAcademy();
  const navigate = useNavigate();

  if (!academy) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center bg-white max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-black mx-auto mb-4" />
          <p className="text-xl font-bold mb-4">먼저 학원을 등록해주세요.</p>
          <Button onClick={() => navigate('/academy')} className="w-full">학원 등록하기</Button>
        </Card>
      </div>);
  }

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full bg-white">
          <Users className="h-16 w-16 text-black mx-auto mb-6" />
          <p className="text-xl font-bold mb-6">아직 등록된 학생이 없습니다.</p>
          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate('/student-input')} className="w-full h-12 text-lg">
              학생 추가하기
            </Button>
            <Button onClick={() => navigate('/csv-import')} variant="outline" className="w-full h-12 text-lg">
              CSV 업로드
            </Button>
          </div>
        </Card>
      </div>);
  }

  // Calculate statistics
  const totalStudents = students.length;
  const averageScore = Math.round(students.reduce((sum, s) => sum + s.calculatedScore, 0) / totalStudents);

  // Grade distribution
  const gradeDistribution = students.reduce((acc, s) => {
    acc[s.gradeLevel] = (acc[s.gradeLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gradeData = Object.entries(gradeDistribution).
  sort((a, b) => a[0].localeCompare(b[0])).
  map(([grade, count]) => ({ grade, count }));

  // Score by exam round
  const scoreByRound = students.reduce((acc, s) => {
    if (!acc[s.examRound]) {
      acc[s.examRound] = { total: 0, count: 0 };
    }
    acc[s.examRound].total += s.calculatedScore;
    acc[s.examRound].count += 1;
    return acc;
  }, {} as Record<string, {total: number;count: number;}>);

  const roundData = Object.entries(scoreByRound).map(([round, data]) => ({
    round,
    average: Math.round(data.total / data.count)
  }));

  // Question analysis
  const questionAnalysis = Array.from({ length: 45 }, (_, i) => {
    const correct = students.filter((s) => s.questions[i]).length;
    return {
      question: i + 1,
      correctRate: Math.round(correct / totalStudents * 100),
      isThreePoint: students.some((s) => s.threePointQuestions.includes(i))
    };
  });

  const exportData = () => {
    const csvContent = [
    ['학생명', '학년', '모의고사 회차', '점수', '등급'].join(','),
    ...students.map((s) => [s.studentName, s.grade, s.examRound, s.calculatedScore, s.gradeLevel].join(','))].
    join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${academy.name}_성적분석_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: '내보내기 완료',
      description: 'CSV 파일이 다운로드되었습니다.'
    });
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <h1 className="text-3xl font-black text-black uppercase tracking-tight">
                성적 분석 대시보드
              </h1>
              <p className="text-black font-bold mt-1 text-lg flex items-center">
                <span className="inline-block w-3 h-3 bg-green-400 border border-black rounded-full mr-2"></span>
                {academy.name}
              </p>
            </div>
            <Button onClick={exportData} variant="outline" className="flex items-center h-12 px-6">
              <Download className="h-5 w-5 mr-2" />
              데이터 내보내기
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black uppercase tracking-wider">총 학생 수</p>
                  <p className="text-4xl font-black mt-2 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{totalStudents}명</p>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-full">
                  <Users className="h-8 w-8 text-black" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black uppercase tracking-wider">평균 점수</p>
                  <p className="text-4xl font-black mt-2 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{averageScore}점</p>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-full">
                  <TrendingUp className="h-8 w-8 text-black" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-pink-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black uppercase tracking-wider">최고 점수</p>
                  <p className="text-4xl font-black mt-2 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {Math.max(...students.map((s) => s.calculatedScore))}점
                  </p>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-full">
                  <Award className="h-8 w-8 text-black" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black uppercase tracking-wider">회차 수</p>
                  <p className="text-4xl font-black mt-2 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{Object.keys(scoreByRound).length}개</p>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-full">
                  <Target className="h-8 w-8 text-black" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-black mb-6 flex items-center">
                <span className="w-4 h-8 bg-purple-500 border-2 border-black mr-3"></span>
                등급 분포
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="grade" tick={{ fill: 'black', fontWeight: 'bold' }} axisLine={{ stroke: 'black', strokeWidth: 2 }} tickLine={false} />
                  <YAxis tick={{ fill: 'black', fontWeight: 'bold' }} axisLine={{ stroke: 'black', strokeWidth: 2 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: '2px solid black', borderRadius: '4px', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                    cursor={{ fill: '#f3f4f6' }} />

                  <Bar dataKey="count" name="학생 수" fill="#a78bfa" stroke="black" strokeWidth={2} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-xl font-black mb-6 flex items-center">
                <span className="w-4 h-8 bg-blue-500 border-2 border-black mr-3"></span>
                회차별 평균 점수
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roundData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="round" tick={{ fill: 'black', fontWeight: 'bold' }} axisLine={{ stroke: 'black', strokeWidth: 2 }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'black', fontWeight: 'bold' }} axisLine={{ stroke: 'black', strokeWidth: 2 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: '2px solid black', borderRadius: '4px', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }} />

                  <Line type="monotone" dataKey="average" name="평균 점수" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, strokeWidth: 2, stroke: 'black', fill: 'white' }} activeDot={{ r: 8, strokeWidth: 2, stroke: 'black', fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Question Analysis */}
          <Card className="p-6 bg-white">
            <h3 className="text-xl font-black mb-6 flex items-center">
              <span className="w-4 h-8 bg-green-500 border-2 border-black mr-3"></span>
              문항별 정답률
            </h3>
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questionAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="question" tick={{ fill: 'black', fontSize: 12 }} axisLine={{ stroke: 'black', strokeWidth: 2 }} tickLine={false} />
                  <YAxis domain={[0, 100]} label={{ value: '정답률 (%)', angle: -90, position: 'insideLeft', fill: 'black', fontWeight: 'bold' }} tick={{ fill: 'black', fontWeight: 'bold' }} axisLine={{ stroke: 'black', strokeWidth: 2 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: '2px solid black', borderRadius: '4px', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }} />

                  <Bar dataKey="correctRate" name="정답률 (%)" fill="#34d399" stroke="black" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm font-bold">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#34d399] border-2 border-black"></div>
                <span>정답률</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 border-2 border-black"></div>
                <span>3점 문항</span>
              </div>
            </div>
          </Card>

          {/* Student List */}
          <Card className="p-0 bg-white overflow-hidden">
             <div className="p-6 border-b-2 border-black bg-yellow-100 flex justify-between items-center">
                <h3 className="text-xl font-black flex items-center">
                  <span className="w-4 h-8 bg-black border-2 border-black mr-3"></span>
                  학생 목록
                </h3>
             </div>
            <div className="overflow-x-auto p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-black bg-gray-100">
                    <th className="text-left py-4 px-4 font-black text-black">이름</th>
                    <th className="text-left py-4 px-4 font-black text-black">학년</th>
                    <th className="text-left py-4 px-4 font-black text-black">회차</th>
                    <th className="text-right py-4 px-4 font-black text-black">점수</th>
                    <th className="text-center py-4 px-4 font-black text-black">등급</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) =>
                  <tr key={student.id} className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
                      <td className="py-3 px-4 font-bold">{student.studentName}</td>
                      <td className="py-3 px-4 font-medium">{student.grade}</td>
                      <td className="py-3 px-4 font-medium">{student.examRound}</td>
                      <td className="py-3 px-4 text-right font-black">{student.calculatedScore}점</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-3 py-1 border-2 border-black rounded-full text-sm font-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {student.gradeLevel}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>);
};

export default Dashboard;