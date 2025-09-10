import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">
              Dịch Vụ Công
            </span>
          </Link>
          <nav>
            {/* Future nav links can go here */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
