import { ProcedureDetail, Service } from './types';

export const mockSearchResults: Service[] = [
  {
    id: 'T-BPC-280421',
    title: 'Thủ tục cấp giấy khai sinh',
    description: 'Thủ tục đăng ký khai sinh cho trẻ em Việt Nam.',
    link: '/dich-vu/T-BPC-280421?ma_thu_tuc=T-BPC-280421',
  },
  {
    id: 'T-BPC-280422',
    title: 'Cấp lại Giấy phép lái xe',
    description: 'Thủ tục cấp lại giấy phép lái xe bị mất hoặc hỏng.',
    link: '/dich-vu/T-BPC-280422?ma_thu_tuc=T-BPC-280422',
  },
  {
    id: 'T-BPC-280426',
    title: 'Đổi Giấy phép lái xe',
    description: 'Thủ tục đổi Giấy phép lái xe do ngành Giao thông vận tải cấp.',
    link: '/dich-vu/T-BPC-280422?ma_thu_tuc=T-BPC-280422',
  },
  {
    id: 'T-BPC-280423',
    title: 'Đăng ký kết hôn',
    description: 'Thủ tục đăng ký kết hôn giữa công dân Việt Nam.',
    link: '/dich-vu/T-BPC-280423?ma_thu_tuc=T-BPC-280423',
  },
  {
    id: 'T-BPC-280424',
    title: 'Cấp thẻ Căn cước công dân',
    description: 'Thủ tục cấp mới, cấp đổi, cấp lại thẻ Căn cước công dân.',
    link: '/dich-vu/T-BPC-280424?ma_thu_tuc=T-BPC-280424',
  },
  {
    id: 'T-BPC-280425',
    title: 'Thủ tục đăng ký, cấp biển số xe',
    description: 'Thủ tục đăng ký xe và cấp biển số xe cơ giới.',
    link: '/dich-vu/T-BPC-280425?ma_thu_tuc=T-BPC-280425',
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
      { id: 'doc1', name: 'Tờ khai đăng ký khai sinh', templateUrl: 'https://csdl.dichvucong.gov.vn/web/jsp/download_file.jsp?ma=3fd5450fb2670b86' },
      { id: 'doc2', name: 'Giấy chứng sinh' },
      { id: 'doc3', name: 'Giấy đăng ký kết hôn của cha mẹ' },
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

export const mockUserInfo = {
  fullName: 'Nguyễn Văn A',
  idNumber: '012345678910',
  dateOfBirth: '01/01/1990',
  address: 'Số 1, Đường ABC, Phường XYZ, Quận Ba Đình, Hà Nội',
};
