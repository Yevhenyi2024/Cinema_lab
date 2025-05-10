function Footer() {
      const currentYear = new Date().getFullYear();
  
      return (
        <footer className="bg-primary text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <div className="mb-4 md:mb-0 text-center">
                <p className="text-lg font-semibold">
                  <span className="text-secondary">Кіно</span>Афіша
                </p>
                <p className="text-sm text-gray-300">
                  © {currentYear} КіноАфіша. Всі права захищено.
                </p>
              </div>
            </div>
          </div>
        </footer>
      );
    }
  
    export default Footer;