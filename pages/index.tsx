import type { NextPage } from 'next';
import PomodoroTimer from '../components/PomodoroTimer';

const Home: NextPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <PomodoroTimer />
    </div>
  );
}

export default Home;