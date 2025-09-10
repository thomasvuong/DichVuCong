import SearchForm from './components/search-form';
import FeaturedServices from './components/featured-services';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
          Tìm kiếm dịch vụ công trực tuyến
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Nền tảng một cửa để tìm kiếm và thực hiện các dịch vụ của chính phủ một cách dễ dàng.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <SearchForm />
      </div>

      <FeaturedServices />
    </div>
  );
}
