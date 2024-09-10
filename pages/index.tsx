import type { NextPage } from 'next';
import PomodoroTimer from '../components/PomodoroTimer';

const Home: NextPage = () => {
  return (
    <div>
      <PomodoroTimer />
    </div>
  );
}

export default Home;