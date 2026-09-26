import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAcademy } from '@/contexts/AcademyContext';
import { GraduationCap, Home, Upload, BarChart3, UserPlus } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { academy } = useAcademy();

  const navItems = [
  { path: '/', label: '홈', icon: Home },
  { path: '/academy', label: '학원 등록', icon: GraduationCap },
  { path: '/student-input', label: '학생 추가', icon: UserPlus },
  { path: '/csv-import', label: 'CSV 업로드', icon: Upload },
  { path: '/dashboard', label: '대시보드', icon: BarChart3 }];


  return (
    <nav className="bg-white border-b-2 border-black py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-yellow-400 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
              <GraduationCap className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight">학원 성적 분석</span>
          </Link>
          
          {academy &&
          <div className="hidden md:flex items-center px-4 py-1 bg-gray-100 border-2 border-black rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {academy.name}
            </div>
          }

          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="bg-black text-white">

                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>);

            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex sm:hidden overflow-x-auto pt-4 pb-2 space-x-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-1 whitespace-nowrap">

                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>);

          })}
        </div>
      </div>
    </nav>);

};

export default Navigation;