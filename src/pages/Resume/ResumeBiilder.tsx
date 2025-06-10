import ResumeFormat from "../../components/custom/ResumeFormat";
import MultiStepResumeForm from "../../components/custom/MuiltiStepResumeForm";
import { useEffect, useState } from "react";
import resumeService from "../../services/resume-service";
import profileService from "../../services/profile-service";
import { ICandidateProfileDataResponse } from "../../utility/interface/ICandidateProfile";

export interface ResumeResponse {
    success: boolean;
    message: string;
    data: ResumeData;
}

export interface ResumeData {
    _id: string;
    user: string;
    fullName: string;
    lastName: string;
    jobTitle: string;
    address: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    degree: string;
    description: string;
    endDate: string;
    major: string;
    startDate: string;
    university: string;
    professionalExperience: ProfessionalExperience[];
    educationDetails: EducationDetail[];
    color: string;
    about: string;
}

export interface ProfessionalExperience {
    positionTitle: string;
    companyName: string;
    city: string;
    state: string;
    startDate: string;
    endDate: string;
    summary: string;
}

export interface EducationDetail {
    university?: string;
    degree: string;
    major?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

const ResumeBuilder = () => {
    const [step, setStep] = useState(1);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [profileData, setProfileData] = useState<ICandidateProfileDataResponse | null>(null);
    const [formData, setFormData] = useState<ResumeData>({
        _id: '',
        user: '',
        fullName: profileData?.full_name || "",
        lastName: '',
        jobTitle: '',
        address: '',
        email: '',
        phone: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
        degree: '',
        description: '',
        endDate: '',
        major: '',
        startDate: '',
        university: '',
        color: "",
        about: "",
        educationDetails: [
            {
                university: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            }
        ],
        professionalExperience: [
            {

                positionTitle: '',
                companyName: '',
                city: '',
                state: '',
                startDate: '',
                endDate: '',
                summary: '',
            }
        ]
    });
    const [selectedColor, setSelectedColor] = useState("#e53935");

    const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = [...prev.professionalExperience];
            updated[index] = { ...updated[index], [name]: value };
            return { ...prev, professionalExperience: updated };
        });
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            professionalExperience: [
                ...prev.professionalExperience,
                {

                    positionTitle: '',
                    companyName: '',
                    city: '',
                    state: '',
                    startDate: '',
                    endDate: '',
                    summary: '',
                }
            ]
        }));
    };

    const removeExperience = (index: number) => {
        setFormData(prev => {
            const updated = [...prev.professionalExperience];
            updated.splice(index, 1);
            return { ...prev, professionalExperience: updated };
        });
    };

    const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = [...prev.educationDetails];
            updated[index] = { ...updated[index], [name]: value };
            return { ...prev, educationDetails: updated };
        });
    };


    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            educationDetails: [
                ...prev.educationDetails,
                {

                    university: '',
                    degree: '',
                    major: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                }
            ]
        }));
    };

    const removeEducation = (index: number) => {
        setFormData(prev => {
            const updated = [...prev.educationDetails];
            updated.splice(index, 1);
            return { ...prev, educationDetails: updated };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    useEffect(() => {
        const fetchResumeInfo = async () => {
                const response = await resumeService.getResumeData();
                const data: any = response?.data.data;
                setResumeData(data);
                setFormData(prev => ({
                    _id: data?._id || '',
                    user: data?.user || '',
                    fullName: profileData?.full_name || prev.fullName || data?.fullName || '',
                    lastName: prev.lastName || data?.lastName || '',
                    jobTitle: prev.jobTitle || data?.jobTitle || '',
                    address: prev.address || data?.address || '',
                    email: prev.email || data?.email || '',
                    phone: prev.phone || data?.phone || '',
                    createdAt: data?.createdAt || '',
                    updatedAt: data?.updatedAt || '',
                    __v: data?.__v || 0,
                    degree: data?.degree || '',
                    description: data?.description || '',
                    endDate: data?.endDate || '',
                    major: data?.major || '',
                    startDate: data?.startDate || '',
                    university: data?.university || '',
                    color: data?.color || selectedColor || "#e11d48",
                    about: prev.about || data?.about || "",
                    educationDetails: Array.isArray(data?.educationDetails)
                        ? data.educationDetails.map((ed: any) => ({
                            university: ed.university || '',
                            degree: ed.degree || '',
                            major: ed.major || '',
                            startDate: ed.startDate || '',
                            endDate: ed.endDate || '',
                            description: ed.description || '',
                        }))
                        : prev.educationDetails,
                    professionalExperience: Array.isArray(data?.professionalExperience)
                        ? data.professionalExperience.map((exp: any) => ({
                            positionTitle: exp.positionTitle || '',
                            companyName: exp.companyName || '',
                            city: exp.city || '',
                            state: exp.state || '',
                            startDate: exp.startDate || '',
                            endDate: exp.endDate || '',
                            summary: exp.summary || '',
                        }))
                        : prev.professionalExperience
                }));           
        };

        fetchResumeInfo();
    }, []);

    const handleSubmit = async () => {
        try {
            const {
                fullName,
                lastName,
                jobTitle,
                address,
                email,
                phone,
                about,
                educationDetails,
                professionalExperience
            } = formData;

            const payload: ResumeData = {
                _id: formData._id,
                user: formData.user,
                fullName,
                lastName,
                jobTitle,
                address,
                email,
                phone,
                about,
                createdAt: formData.createdAt,
                updatedAt: formData.updatedAt,
                __v: formData.__v,
                degree: formData.degree,
                description: formData.description,
                endDate: formData.endDate,
                major: formData.major,
                startDate: formData.startDate,
                university: formData.university,
                color: formData.color,
                educationDetails,
                professionalExperience
            };

            await resumeService.createResume(payload);
            if (step !== 3) goNext();
            await getResumeInfo();
        } catch (error) {
            console.error("Error submitting resume:", error);
        }
    };


    const getResumeInfo = async () => {
        try {
            const response: any = await resumeService.getResumeData();
            setResumeData(response?.data);
        } catch (error) {
            console.error('Failed to fetch resume:', error);
        }
    };
    const getCandidateProfileData = async () => {
        try {
            const response = await profileService.getCandidateProfileData();
            setProfileData(response?.data?.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([
                getResumeInfo(),
                getCandidateProfileData()
            ]);
        };
        fetchAllData();
    }, []);

    const goNext = () => setStep(step + 1);
    const goBack = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg">
                    <MultiStepResumeForm
                        resumeData={resumeData}
                        goNext={goNext}
                        goBack={goBack}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        step={step}
                        formData={formData}
                        handleExperienceChange={handleExperienceChange}
                        addExperience={addExperience}
                        removeExperience={removeExperience}
                        handleEducationChange={handleEducationChange}
                        addEducation={addEducation}
                        removeEducation={removeEducation}
                        setSelectedColor={setSelectedColor}
                        selectedColor={selectedColor}
                    />
                </div>
                <ResumeFormat resumeData={resumeData} />
            </div>
        </div>
    );
};

export default ResumeBuilder;
