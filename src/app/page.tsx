import React from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { SITE_CONFIG } from '@/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Fetch config from DB to allow admin updates to biography text if implemented
  const { data: dbConfig } = await supabase.from('site_config').select('*').single();
  const config = dbConfig ? { ...SITE_CONFIG, ...dbConfig } : SITE_CONFIG;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bio Section */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow-sm h-fit">
            <p className="text-gray-700 leading-relaxed mb-4">
                <span className="font-bold text-gray-900">Dr. Abubakar Mohammed Bokani</span> is a Senior Lecturer in the Department of Private Law at Ahmadu Bello University, Zaria , where he teaches courses including Law of Contract , Equity & Trusts , and Law for Engineers. His research focuses on land law , real property , trusts , constitutional law , and gender and the law.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              Dr. Bokani has authored numerous articles in peer-reviewed journals , such as the ABU Law Journal , the Journal of Private and Comparative Law , and the UNIZIK Law Journal. He is an active member of the Nigerian Bar Association and the Nigerian Association of Law Teachers. At ABU, he serves as the Coordinator of the A.B.U. Law Clinic and is the Secretary of the Editorial Boards for both the ABU Law Journal and the Journal of Private and Comparative Law.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
                Before beginning his teaching career in 2017 , he worked as a Legal Practitioner at Ibrahim Ndamitso & Co. and Ndagi Musa &Co. in Minna , and as a Pupil Counsel at G. Hassan & Co..
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
               Dr. Bokani earned his Ph.D (2023) , LL.M (2016) , and LL.B (Sharia) (2009)  from Ahmadu Bello University, Zaria. He received his B.L. from the Nigerian Law School, Abuja (2010).
            </p>
        </div>

        {/* Sidebar */}
        <Sidebar />
    </div>
  );
}