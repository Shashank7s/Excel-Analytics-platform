import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { BarChart3, TrendingUp, FileSpreadsheet, Users } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Excel File Upload',
      description: 'Upload .xlsx and .xls files with drag-and-drop functionality',
    },
    {
      icon: BarChart3,
      title: 'Interactive Charts',
      description: 'Generate beautiful bar, line, pie, and scatter plot charts',
    },
    {
      icon: TrendingUp,
      title: 'Data Analytics',
      description: 'Get insights from your data with advanced analytics tools',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share charts and collaborate with your team members',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">Excel Analytics</h1>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Transform Your Data Into Beautiful Insights
            </h2>
            
            <p className="text-blue-100 text-lg mb-12">
              Upload your Excel files and create stunning visualizations with our powerful analytics platform. 
              Get insights from your data in minutes, not hours.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Excel Analytics</h1>
              </div>
            </div>

            {isLogin ? (
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onToggleMode={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;