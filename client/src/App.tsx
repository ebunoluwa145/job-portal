import { AppRouter } from './app/AppRouter';
import { Navbar } from './component/layout/Navbar';


function App() {
  return (
    <div className="min-h-screen bg-aventon-light font-sans text-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <AppRouter />
      </main>
   
    </div>
  );
}

export default App;