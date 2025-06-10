const ResumeFormat = (props: any): any => {
  const resumeInfo = props.resumeData?.data;

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl">
        {resumeInfo ? (
          <div className="h-screen max-w-3xl mx-auto p-8 bg-white shadow-md border border-gray-200 overflow-y-auto">
            <header className="text-center mb-4 border-b border-red-300">
              <h1 className="text-3xl font-bold text-red-700">
                {resumeInfo.fullName || ''} {resumeInfo.lastName || ''}
              </h1>
              <h2 className="text-xl text-gray-700">{resumeInfo.jobTitle || ''}</h2>
              <p className="text-sm text-gray-500">{resumeInfo.address || ''}</p>
              <div className="flex justify-between text-sm text-red-500 mt-1 mb-4">
                <span>{resumeInfo.phone || ''}</span>
                <span>{resumeInfo.email || ''}</span>
              </div>
            </header>

            <section className="mb-8">
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {resumeInfo.about || 'No bio available.'}
              </p>
            </section>

            {Array.isArray(resumeInfo.professionalExperience) &&
              resumeInfo.professionalExperience.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-lg text-center font-semibold text-red-600 border-b border-red-300 pb-1 mb-4">
                    Professional Experience
                  </h3>
                  {resumeInfo.professionalExperience.map((experience: any, index: number) => (
                    <div key={index} className="mb-4">
                      <h4 className="text-red-600 font-bold">
                        {experience.positionTitle || 'Untitled Position'}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {experience.city || ''} {experience.state ? `, ${experience.state}` : ''}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        {experience.startDate || 'N/A'} to {experience.endDate || 'N/A'}
                      </p>
                      {experience.summary && (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          <li>{experience.summary}</li>
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              )}

            {Array.isArray(resumeInfo.educationDetails) &&
              resumeInfo.educationDetails.length > 0 && (
                <section>
                  <h3 className="text-lg text-center font-semibold text-red-600 border-b border-red-300 pb-1 mb-4">
                    Education
                  </h3>
                  {resumeInfo.educationDetails.map((edu: any, index: number) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-bold text-gray-800">{edu.university || 'Unknown University'}</h4>
                      <p className="text-sm text-gray-600">
                        {edu.degree || 'Degree'}{edu.major ? `, ${edu.major}` : ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate || 'N/A'} to {edu.endDate || 'N/A'}
                      </p>
                    </div>
                  ))}
                </section>
              )}
          </div>
        ) : (
          <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="text-center text-gray-500">No resume data available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeFormat;
