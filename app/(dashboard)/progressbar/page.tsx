
import ProgressBar from '@/components/progressbar';

const HomePage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2">
        <h1 className="text-3xl font-bold text-center mb-4">Loading Progress</h1>
        <ProgressBar />
      </div>
    </div>
  );
};

export default HomePage;
