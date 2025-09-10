const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Dịch Vụ Công Trực Tuyến. All rights reserved.</p>
        <p className="text-sm mt-2">Đây là một sản phẩm giả lập cho mục đích trình diễn.</p>
      </div>
    </footer>
  );
};

export default Footer;
