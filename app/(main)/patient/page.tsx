import PatientForm from "@/components/patient/PatientForm";

export const metadata = {
  title: "Patient Registration",
};

export default function PatientPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-basic-gray-10 to-basic-gray-20 px-4 py-8 sm:py-12">
      <PatientForm />
    </main>
  );
}
