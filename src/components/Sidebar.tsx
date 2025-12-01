import React from 'react';
import { SITE_CONFIG } from '@/constants';

const Sidebar: React.FC = () => {
  return (
    <div className="space-y-6">
        {/* Profile Image */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <img 
              src="/images/abubakarbokani.jpg" 
              alt="Dr. Abubakar Bokani" 
              className="w-full h-auto rounded-lg mb-2" 
            />
        </div>

        {/* Email */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Email</h3>
            <a href="mailto:ambokani@abu.edu.ng" className="text-red-600 hover:text-red-700 text-sm block">ambokani@abu.edu.ng</a>
            <a href="mailto:ambokani8@gmail.com" className="text-red-600 hover:text-red-700 text-sm block">ambokani8@gmail.com</a>
        </div>

        {/* Office */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Office</h3>
            <div className="text-sm text-gray-700 space-y-1">
                <p>Department of Private Law</p>
                <p>Faculty of Law ,</p>
                <p>Ahmadu Bello University</p>
                <p>Zaria, Nigeria</p>
                <p>(+234) 0806 5591 824</p>
            </div>
        </div>

        {/* Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Info</h3>
            <div className="space-y-2">
                <a href="https://law.abu.edu.ng/staff/" target="_blank" rel="noreferrer" className="block text-sm text-red-600 hover:text-red-700">Faculty of Law ABU Directory</a>
                <a href={SITE_CONFIG.social.ssrn || "#"} target="_blank" rel="noreferrer" className="block text-sm text-red-600 hover:text-red-700">SSRN Author Page</a>
                <a href={SITE_CONFIG.social.scholar || "#"} target="_blank" rel="noreferrer" className="block text-sm text-red-600 hover:text-red-700">Google Scholar</a>
                <a href="https://orcid.org/0000-0001-8559-9881" target="_blank" rel="noreferrer" className="block text-sm text-red-600 hover:text-red-700">ORCID</a>
            </div>
        </div>
    </div>
  );
};

export default Sidebar;