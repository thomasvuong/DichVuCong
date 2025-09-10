import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Newspaper, CopyCheck, Plug, ArrowRight } from 'lucide-react';

const featuredServices = [
  {
    title: 'Đăng ký, cấp biển số xe',
    icon: Car,
    href: '/search?query=đăng ký xe',
  },
  {
    title: 'Đổi Giấy phép lái xe',
    icon: Newspaper,
    href: '/search?query=đổi giấy phép lái xe',
  },
  {
    title: 'Chứng thực bản sao từ bản chính',
    icon: CopyCheck,
    href: '/search?query=chứng thực bản sao',
  },
  {
    title: 'Cấp điện mới từ lưới điện hạ áp',
    icon: Plug,
    href: '/search?query=cấp điện mới',
  },
];

export default function FeaturedServices() {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Dịch vụ công nổi bật
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredServices.map((service) => (
          <Link href={service.href} key={service.title}>
            <Card className="h-full hover:shadow-md hover:-translate-y-1 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium pr-4">{service.title}</CardTitle>
                <service.icon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Thực hiện ngay</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        <Link href="/search?query=dịch vụ công">
          <Card className="h-full bg-primary/10 hover:bg-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-200 border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium text-primary">Xem tất cả dịch vụ</CardTitle>
              <ArrowRight className="h-6 w-6 text-primary" />
            </CardHeader>
             <CardContent>
                <p className="text-xs text-primary/80">Khám phá thêm</p>
              </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
