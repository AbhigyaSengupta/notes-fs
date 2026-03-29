import Navbar from '../components/Navbar';
import NotesPage from './NotesPage';

const Home = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <NotesPage />
    </div>
  );
};

export default Home;
