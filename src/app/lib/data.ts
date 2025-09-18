import { ProcedureDetail, Service, FormFieldConfig, UserInfo } from './types';

const birthCertificateFormFields: FormFieldConfig[] = [
  { id: 'ho_ten_nguoi_yeu_cau', label: 'Họ tên người yêu cầu', placeholder: 'Nguyễn Văn A', group: 'Thông tin người yêu cầu' },
  { id: 'dia_chi_nguoi_yeu_cau', label: 'Địa chỉ người yêu cầu', placeholder: 'Số 1, Đường ABC, Hà Nội', group: 'Thông tin người yêu cầu' },
  { id: 'sdt_nguoi_yeu_cau', label: 'Số điện thoại', placeholder: '09xxxxxxxx', group: 'Thông tin người yêu cầu' },
  { id: 'ho_ten_nguoi_duoc_khai_sinh', label: 'Họ và tên người được khai sinh', placeholder: 'Nguyễn Thị B', group: 'Thông tin người được khai sinh' },
  { id: 'ngay_sinh', label: 'Ngày sinh', placeholder: 'dd/mm/yyyy', group: 'Thông tin người được khai sinh' },
  { id: 'gioi_tinh', label: 'Giới tính', placeholder: 'Nữ', group: 'Thông tin người được khai sinh' },
  { id: 'dan_toc', label: 'Dân tộc', placeholder: 'Kinh', group: 'Thông tin người được khai sinh' },
  { id: 'quoc_tich', label: 'Quốc tịch', placeholder: 'Việt Nam', group: 'Thông tin người được khai sinh' },
  { id: 'noi_sinh', label: 'Nơi sinh', placeholder: 'Bệnh viện Phụ sản Hà Nội', group: 'Thông tin người được khai sinh' },
  { id: 'que_quan', label: 'Quê quán', placeholder: 'Hà Nội', group: 'Thông tin người được khai sinh' },
  { id: 'ho_ten_cha', label: 'Họ và tên cha', placeholder: 'Nguyễn Văn C', group: 'Thông tin cha' },
  { id: 'dan_toc_cha', label: 'Dân tộc của cha', placeholder: 'Kinh', group: 'Thông tin cha' },
  { id: 'quoc_tich_cha', label: 'Quốc tịch của cha', placeholder: 'Việt Nam', group: 'Thông tin cha' },
  { id: 'noi_cu_tru_cha', label: 'Nơi cư trú của cha', placeholder: 'Số 1, Đường ABC, Hà Nội', group: 'Thông tin cha' },
  { id: 'ho_ten_me', label: 'Họ và tên mẹ', placeholder: 'Trần Thị D', group: 'Thông tin mẹ' },
  { id: 'dan_toc_me', label: 'Dân tộc của mẹ', placeholder: 'Kinh', group: 'Thông tin mẹ' },
  { id: 'quoc_tich_me', label: 'Quốc tịch của mẹ', placeholder: 'Việt Nam', group: 'Thông tin mẹ' },
  { id: 'noi_cu_tru_me', label: 'Nơi cư trú của mẹ', placeholder: 'Số 1, Đường ABC, Hà Nội', group: 'Thông tin mẹ' },
];


export const mockSearchResults: Service[] = [
  {
    id: 'T-BPC-280421',
    title: 'Thủ tục cấp giấy khai sinh',
    description: 'Thủ tục đăng ký khai sinh cho trẻ em Việt Nam.',
    link: '/dich-vu/T-BPC-280421',
  },
  {
    id: 'T-BPC-280422',
    title: 'Cấp lại Giấy phép lái xe',
    description: 'Thủ tục cấp lại giấy phép lái xe bị mất hoặc hỏng.',
    link: '/dich-vu/T-BPC-280422',
  },
  {
    id: 'T-BPC-280426',
    title: 'Đổi Giấy phép lái xe',
    description: 'Thủ tục đổi Giấy phép lái xe do ngành Giao thông vận tải cấp.',
    link: '/dich-vu/T-BPC-280426',
  },
  {
    id: 'T-BPC-280423',
    title: 'Đăng ký kết hôn',
    description: 'Thủ tục đăng ký kết hôn giữa công dân Việt Nam.',
    link: '/dich-vu/T-BPC-280423',
  },
  {
    id: 'T-BPC-280424',
    title: 'Cấp thẻ Căn cước công dân',
    description: 'Thủ tục cấp mới, cấp đổi, cấp lại thẻ Căn cước công dân.',
    link: '/dich-vu/T-BPC-280424',
  },
  {
    id: 'T-BPC-280425',
    title: 'Thủ tục đăng ký, cấp biển số xe',
    description: 'Thủ tục đăng ký xe và cấp biển số xe cơ giới.',
    link: '/dich-vu/T-BPC-280425',
  },
];

export const mockProcedureDetails: ProcedureDetail[] = [
  {
    id: 'T-BPC-280421',
    title: 'Thủ tục cấp giấy khai sinh',
    description: 'Đăng ký khai sinh là thủ tục hành chính ghi nhận sự ra đời của một cá nhân, là cơ sở pháp lý để công nhận các quyền và nghĩa vụ của người đó.',
    agency: 'Ủy ban nhân dân cấp xã',
    procedure: '1. Nộp hồ sơ tại bộ phận một cửa. 2. Cán bộ tư pháp kiểm tra hồ sơ. 3. Chủ tịch UBND xã ký Giấy khai sinh. 4. Trả kết quả cho công dân.',
    submissionMethod: 'Trực tuyến hoặc trực tiếp',
    processingTime: 'Trong ngày',
    fee: 'Miễn phí',
    requiredDocuments: [
      { id: 'doc1', name: 'Tờ khai đăng ký khai sinh', templateUrl: 'https://csdl.dichvucong.gov.vn/web/jsp/download_file.jsp?ma=3fd5450fb2670b86', onlineForm: birthCertificateFormFields },
      { id: 'doc2', name: 'Giấy chứng sinh' },
      { id: 'doc3', name: 'Giấy đăng ký kết hôn của cha mẹ' },
    ],
  },
  {
    id: 'T-BPC-280422',
    title: 'Cấp lại Giấy phép lái xe',
    description: 'Thủ tục hành chính để cấp lại giấy phép lái xe đã bị mất hoặc hỏng, giúp công dân có đủ điều kiện pháp lý để tiếp tục điều khiển phương tiện giao thông.',
    agency: 'Sở Giao thông vận tải',
    procedure: '1. Nộp hồ sơ trực tuyến hoặc trực tiếp. 2. Cơ quan cấp GPLX tiếp nhận hồ sơ. 3. Xác minh hồ sơ và hồ sơ gốc. 4. In và trả GPLX mới cho công dân.',
    submissionMethod: 'Trực tuyến',
    processingTime: '5 ngày làm việc',
    fee: '135,000 VNĐ',
    requiredDocuments: [
        { id: 'doc1', name: 'Đơn đề nghị cấp lại giấy phép lái xe', templateUrl: 'https://csdl.dichvucong.gov.vn/web/jsp/download_file.jsp?ma=1b79f4c3c2f62308' },
        { id: 'doc2', name: 'Bản sao CCCD/Hộ chiếu' },
        { id: 'doc3', name: 'Giấy khám sức khỏe' },
    ],
  },
   {
    id: 'T-BPC-280426',
    title: 'Đổi Giấy phép lái xe',
    description: 'Thủ tục hành chính để đổi giấy phép lái xe sắp hết hạn, bị hỏng hoặc thay đổi thông tin cá nhân.',
    agency: 'Sở Giao thông vận tải',
    procedure: '1. Kê khai thông tin và nộp hồ sơ trực tuyến. 2. Thanh toán lệ phí. 3. Chờ xác nhận và nhận giấy hẹn. 4. Nhận giấy phép lái xe mới qua đường bưu điện hoặc tại cơ quan cấp.',
    submissionMethod: 'Trực tuyến',
    processingTime: '5 ngày làm việc',
    fee: '135,000 VNĐ',
    requiredDocuments: [
        { id: 'doc1', name: 'Đơn đề nghị đổi giấy phép lái xe', templateUrl: 'https://csdl.dichvucong.gov.vn/web/jsp/download_file.jsp?ma=1b79f4c3c2f62308' },
        { id: 'doc2', name: 'Bản scan giấy phép lái xe cũ' },
        { id: 'doc3', name: 'Ảnh chân dung 3x4' },
        { id: 'doc4', name: 'Bản sao CCCD' },
    ],
  },
  {
    id: 'T-BPC-280423',
    title: 'Đăng ký kết hôn',
    description: 'Thủ tục hành chính nhằm xác lập quan hệ vợ chồng theo quy định của pháp luật.',
    agency: 'Ủy ban nhân dân cấp xã',
    procedure: '1. Hai bên nam, nữ nộp tờ khai và giấy tờ tại UBND. 2. Cán bộ tư pháp kiểm tra, xác minh. 3. Nếu đủ điều kiện, hai bên ký vào Giấy chứng nhận kết hôn và sổ đăng ký. 4. Chủ tịch UBND xã ký và cấp Giấy chứng nhận kết hôn.',
    submissionMethod: 'Trực tiếp tại UBND cấp xã',
    processingTime: 'Ngay trong ngày làm việc',
    fee: 'Miễn phí',
    requiredDocuments: [
        { id: 'doc1', name: 'Tờ khai đăng ký kết hôn', templateUrl: 'https://csdl.dichvucong.gov.vn/web/jsp/download_file.jsp?ma=2a5437430b3554d6' },
        { id: 'doc2', name: 'CCCD của hai bên nam, nữ' },
        { id: 'doc3', name: 'Giấy xác nhận tình trạng hôn nhân (nếu đăng ký tại nơi khác hộ khẩu thường trú)' },
    ],
  },
  {
    id: 'T-BPC-280424',
    title: 'Cấp thẻ Căn cước công dân',
    description: 'Thủ tục cấp mới, cấp đổi, hoặc cấp lại thẻ Căn cước công dân gắn chip điện tử.',
    agency: 'Công an cấp huyện/tỉnh',
    procedure: '1. Công dân đến cơ quan công an để làm thủ tục. 2. Cung cấp thông tin, chụp ảnh, lấy vân tay. 3. Nộp lệ phí. 4. Nhận giấy hẹn trả thẻ CCCD.',
    submissionMethod: 'Trực tiếp tại cơ quan Công an',
    processingTime: '7-15 ngày làm việc',
    fee: 'Theo quy định',
    requiredDocuments: [
        { id: 'doc1', name: 'Sổ hộ khẩu hoặc giấy tờ xác nhận thông tin công dân' },
        { id: 'doc2', name: 'CMND cũ (nếu có, để đối chiếu)' },
    ],
  },
  {
    id: 'T-BPC-280425',
    title: 'Thủ tục đăng ký, cấp biển số xe',
    description: 'Thủ tục hành chính để đăng ký sở hữu xe cơ giới và được cấp biển số để lưu thông hợp pháp trên đường.',
    agency: 'Phòng Cảnh sát giao thông cấp tỉnh/thành phố',
    procedure: '1. Kê khai, nộp hồ sơ đăng ký xe. 2. Đóng lệ phí trước bạ. 3. Cán bộ CSGT kiểm tra xe và hồ sơ. 4. Bấm chọn biển số ngẫu nhiên. 5. Nhận giấy hẹn và biển số xe.',
    submissionMethod: 'Trực tuyến và trực tiếp tại cơ quan đăng ký',
    processingTime: '2 ngày làm việc',
    fee: 'Theo quy định của Bộ Tài chính',
    requiredDocuments: [
        { id: 'doc1', name: 'Tờ khai đăng ký xe' },
        { id: 'doc2', name: 'Giấy tờ nguồn gốc xe (hóa đơn, tờ khai nhập khẩu)' },
        { id: 'doc3', name: 'Giấy tờ của chủ xe (CCCD/CMND)' },
        { id: 'doc4', name: 'Chứng từ lệ phí trước bạ' },
    ],
  },
];

export const mockUserInfo: UserInfo = {
  fullName: 'Nguyễn Văn A',
  idNumber: '012345678910',
  dateOfBirth: '01/01/1990',
  address: 'Số 1, Đường ABC, Phường XYZ, Quận Ba Đình, Hà Nội',
  phoneNumber: '0987654321',
};
