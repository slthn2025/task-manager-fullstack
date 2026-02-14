import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

      {/* Navbar Fixed */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-20 px-4">
        {children}
      </main>

    </div>
  );
}

export default Layout;