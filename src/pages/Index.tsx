
import TravelForm from "../components/TravelForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Travel & LAFHA Request System</h1>
        <TravelForm />
      </div>
    </div>
  );
};

export default Index;
