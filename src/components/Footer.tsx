export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground font-sans">
              © {new Date().getFullYear()} Find My Bike
            </p>
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            <p>
              Results are provided by{" "}
              <a
                href="https://www.ebay.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors">
                eBay UK
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
