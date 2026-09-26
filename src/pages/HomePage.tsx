import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAcademy } from '@/contexts/AcademyContext';
import { GraduationCap, Upload, BarChart3, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();
  const { academy, students } = useAcademy();

  const features = [
  {
    icon: Upload,
    title: 'CSV 일괄 업로드',
    description: '학생 데이터를 CSV 파일로 한 번에 업로드하세요.',
    bg: 'bg-blue-100',
    iconBg: 'bg-blue-400'
  },
  {
    icon: BarChart3,
    title: '성적 분석',
    description: '학생들의 성적을 자동으로 분석하고 시각화합니다.',
    bg: 'bg-green-100',
    iconBg: 'bg-green-400'
  },
  {
    icon: TrendingUp,
    title: '추세 파악',
    description: '회차별 성적 변화를 한눈에 확인하세요.',
    bg: 'bg-yellow-100',
    iconBg: 'bg-yellow-400'
  },
  {
    icon: CheckCircle,
    title: '문항 분석',
    description: '2점/3점 문항을 자동 인식하고 정답률을 분석합니다.',
    bg: 'bg-pink-100',
    iconBg: 'bg-pink-400'
  }];


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">

            <GraduationCap className="h-12 w-12 text-black" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-black">

            학원 성적 분석 <span className="text-blue-600 underline decoration-4 underline-offset-4">시스템</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">

            복잡한 성적 처리는 이제 그만.<br />
            직관적인 대시보드로 학생들의 성장을 관리하세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-8">

            {academy ?
            <div className="space-y-8">
                <Card className="p-8 bg-white border-2 border-black max-w-2xl mx-auto transform hover:-translate-y-1 transition-transform">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-100 border-2 border-black rounded-lg">
                        <Users className="h-8 w-8 text-black" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Current Academy</p>
                        <p className="text-2xl font-black text-black">{academy.name}</p>
                      </div>
                    </div>
                    <div className="text-center md:text-right bg-gray-50 p-4 border-2 border-black rounded-lg min-w-[120px]">
                      <p className="text-sm font-bold text-gray-500">등록 학생</p>
                      <p className="text-3xl font-black text-blue-600">{students.length}</p>
                    </div>
                  </div>
                </Card>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                  size="lg"
                  onClick={() => navigate('/student-input')}
                  className="h-14 text-lg bg-blue-400 hover:bg-blue-500 border-2 border-black text-black">

                    <Users className="mr-2 h-5 w-5" />
                    학생 추가
                  </Button>
                  <Button
                  size="lg"
                  onClick={() => navigate('/csv-import')}
                  className="h-14 text-lg bg-pink-400 hover:bg-pink-500 border-2 border-black text-black">

                    <Upload className="mr-2 h-5 w-5" />
                    CSV 업로드
                  </Button>
                  <Button
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="h-14 text-lg bg-green-400 hover:bg-green-500 border-2 border-black text-black">

                    <BarChart3 className="mr-2 h-5 w-5" />
                    대시보드
                  </Button>
                </div>
              </div> :

            <Button
              size="lg"
              onClick={() => navigate('/academy')}
              className="h-16 px-10 text-xl bg-black text-white hover:bg-gray-800 border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]">

                <GraduationCap className="mr-3 h-8 w-8" />
                지금 시작하기
              </Button>
            }
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t-2 border-black bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">
            주요 기능
            <span className="block text-lg font-normal text-gray-600 mt-4">학원 운영에 꼭 필요한 기능만 담았습니다</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}>

                  <Card className={`h-full p-6 border-2 border-black hover:-translate-y-2 transition-transform duration-300 ${feature.bg}`}>
                    <div className={`w-14 h-14 ${feature.iconBg} border-2 border-black rounded-lg flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      <Icon className="h-7 w-7 text-black" />
                    </div>
                    <h3 className="text-xl font-black mb-3 text-black">{feature.title}</h3>
                    <p className="text-gray-800 font-medium leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>);

            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-400 border-t-2 border-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-black">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl font-bold mb-10 text-black/80">
            복잡한 설치 없이 바로 사용할 수 있습니다.
          </p>
          {!academy &&
          <Button
            size="lg"
            onClick={() => navigate('/academy')}
            className="h-16 px-12 text-xl bg-white text-black border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]">

              무료로 시작하기 <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          }
        </div>
      </section>
    </div>);

};

export default HomePage;