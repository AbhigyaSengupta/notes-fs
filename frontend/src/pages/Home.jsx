import Navbar from '../components/Navbar';
import NotesPage from './NotesPage';

const Home = () => {
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <NotesPage />
    </div>
  );
};

export default Home;
