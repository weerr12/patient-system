export type PatientStatus = "idle" | "filling" | "submitted";
export interface PatientFormData {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    email: string;
    address: string;
    preferredLanguage: string;
    nationality: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    religion?: string;
}

export interface PatientSession {
    sessionId: string;
    status: PatientStatus;
    data: Partial<PatientFormData>;
    lastActivity: string;
}

export const EMPTY_FORM: PatientFormData = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    preferredLanguage: '',
    nationality: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    religion: '',
}

type Option = { label: string; value: string };

export const GENDER_OPTIONS: Option[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
];

export const LANGUAGE_OPTIONS: Option[] = [
    { label: "English", value: "english" },
    { label: "Thai", value: "thai" },
    { label: "Chinese", value: "chinese" },
    { label: "Japanese", value: "japanese" },
    { label: "Other", value: "other" },
];

export const NATIONALITY_OPTIONS: Option[] = [
    { label: "Thai", value: "thai" },
    { label: "Chinese", value: "chinese" },
    { label: "Japanese", value: "japanese" },
    { label: "Other", value: "other" },
];

export const RELATIONSHIP_OPTIONS: Option[] = [
    { label: "Father", value: "father" },
    { label: "Mother", value: "mother" },
    { label: "Brother", value: "brother" },
    { label: "Sister", value: "sister" },
    { label: "Spouse", value: "spouse" },
    { label: "Other", value: "other" },
];