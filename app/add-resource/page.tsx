import Header from '../components/Header';
import SearchResource from '../components/SearchResource';

const AddResourcePage = () => {
  return (
    <main>
      <Header />
      <div className="p-6 top-0 z-20 bg-white py-4">
        <SearchResource />
      </div>
    </main>
  );
};

export default AddResourcePage;
