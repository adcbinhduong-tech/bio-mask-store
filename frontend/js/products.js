/**
 * BIOCELLA - Danh sách sản phẩm Mặt Nạ Sinh Học Cao Cấp
 * Lên men 100% từ nước dừa tươi Bến Tre theo công nghệ vi sinh Bio-Cellulose y khoa
 */

const PRODUCTS = [
  {
    id: "bio-b5-hydra",
    name: "Mặt Nạ Sinh Học B5 & Hyaluronic Cấp Ẩm Phục Hồi Chuyên Sâu",
    subtitle: "Deep Moisture & Barrier Repair Bio-Cellulose Mask",
    category: "recovery",
    skinTypes: ["dry", "sensitive", "treatment"],
    price: 65000,
    originalPrice: 85000,
    rating: 4.9,
    reviewCount: 328,
    soldCount: 4200,
    badge: "Bán Chạy Nhất",
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1608248597359-5f21297b4ec0?auto=format&fit=crop&w=800&q=80",
    description: "Mặt nạ sợi sinh học dệt từ 100% nước dừa tươi lên men nguyên chất, ngậm đẫm 28ml tinh chất Vitamin B5 (Panthenol 5%), 5 loại Hyaluronic Acid đa phân tử và Ceramide NP. Khóa ẩm tức thì, làm dịu da cháy nắng, phục hồi hàng rào bảo vệ da sau laser/peel.",
    keyIngredients: [
      { name: "Vitamin B5 (Panthenol 5%)", role: "Phục hồi tổn thương mô da & giảm đỏ tức thì" },
      { name: "5D Hyaluronic Acid", role: "Cấp ẩm đa tầng từ biểu bì đến hạ bì" },
      { name: "Ceramide NP & Ectoin", role: "Củng cố màng lipid, chống mất nước xuyên biểu bì" },
      { name: "Nước dừa Bến Tre lên men", role: "Sợi nano 20nm ôm khít từng nếp nhăn, làm dịu mát tự nhiên" }
    ],
    features: [
      "Màng cellulose nano siêu mỏng chỉ 0.2mm, ôm khít 100% đường cong gương mặt",
      "Khả năng hấp thụ và thẩm thấu dưỡng chất gấp 20 lần mặt nạ giấy thông thường",
      "Làm mát da lập tức -3°C ngay khi đắp, không gây bí rít hay kích ứng",
      "An toàn tuyệt đối cho cả phụ nữ mang thai và làn da sau điều trị thẩm mỹ"
    ],
    usage: [
      "Bước 1: Rửa mặt sạch và cân bằng da với toner dịu nhẹ.",
      "Bước 2: Gỡ bỏ 1 lớp màng lưới bảo vệ, áp nhẹ nhàng mặt nạ sinh học ôm khít khuôn mặt.",
      "Bước 3: Gỡ tiếp lớp lưới bảo vệ thứ 2, điều chỉnh để mặt nạ bám sát toàn bộ gương mặt.",
      "Bước 4: Thư giãn 25 - 40 phút (không bị hút ẩm ngược như mask giấy). Tháo ra và vỗ nhẹ dưỡng chất."
    ],
    volume: "28ml / 1 miếng",
    origin: "Công nghệ sinh học Bio-Cellulose chuẩn cGMP"
  },
  {
    id: "bio-glow-niacinamide",
    name: "Mặt Nạ Sinh Học Niacinamide 10% & Arbutin Trắng Hồng Mờ Thâm",
    subtitle: "Radiance Brightening & Dark Spot Corrector Bio-Mask",
    category: "brightening",
    skinTypes: ["dull", "oily", "normal"],
    price: 69000,
    originalPrice: 90000,
    rating: 4.8,
    reviewCount: 254,
    soldCount: 3100,
    badge: "Mờ Thâm Sau 7 Ngày",
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    description: "Giải pháp ức chế melanin tối ưu với công thức phức hợp Niacinamide tinh khiết 10%, Alpha Arbutin và Glutathione bọc liposome. Dưỡng da trắng trong veo, làm đều màu các vết thâm sau mụn và đem lại hiệu ứng căng bóng chuẩn Glass Skin Hàn Quốc.",
    keyIngredients: [
      { name: "Niacinamide 10% Tinh Khiết", role: "Mờ thâm mụn, se khít lỗ chân lông, kiềm dầu" },
      { name: "Alpha Arbutin & Glutathione", role: "Ức chế tyrosinase hình thành sắc tố sạm nám" },
      { name: "Chiết xuất Hoa Cúc La Mã", role: "Làm dịu, chống oxy hóa và ngừa kích ứng" },
      { name: "Màng Bio-Cellulose dừa", role: "Dẫn truyền hoạt chất làm trắng sâu vào tế bào" }
    ],
    features: [
      "Cải thiện độ sáng và đều màu da rõ rệt chỉ sau 3 lần đắp",
      "Không chứa cồn, không hương liệu tổng hợp, không paraben",
      "Cung cấp dưỡng chất nuôi dưỡng sắc tố da hồng hào tự nhiên",
      "Khả năng bám dính chắc chắn, thoải mái vận động làm việc khi đắp"
    ],
    usage: [
      "Bước 1: Làm sạch da mặt với nước tẩy trang và sữa rửa mặt.",
      "Bước 2: Mở gói, tách 1 lớp lưới định hình và đắp lớp màng sinh học lên mặt.",
      "Bước 3: Lột bỏ lớp lưới còn lại, vuốt nhẹ cho màng ôm khít.",
      "Bước 4: Đắp 30 phút, gỡ bỏ và massage phần tinh chất còn dư cho vùng cổ."
    ],
    volume: "28ml / 1 miếng",
    origin: "Công nghệ sinh học Bio-Cellulose chuẩn cGMP"
  },
  {
    id: "bio-cica-acne",
    name: "Mặt Nạ Sinh Học Rau Má Centella & Tràm Trà Kháng Viêm Giảm Mụn",
    subtitle: "Soothing Cica & Tea Tree Blemish Calming Bio-Mask",
    category: "acne",
    skinTypes: ["oily", "acne", "sensitive"],
    price: 62000,
    originalPrice: 80000,
    rating: 4.9,
    reviewCount: 412,
    soldCount: 5600,
    badge: "Khuyên Dùng Cho Da Mụn",
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    description: "Cứu tinh cho làn da dầu mụn sưng viêm, bít tắc chân lông hoặc sau khi nặn mụn. Chiết xuất Centella Asiatica 85% kết hợp tràm trà hữu cơ chưng cất và BHA Salicylic Acid tự nhiên từ vỏ cây liễu trắng giúp tiêu viêm, xẹp mụn và ngăn ngừa sẹo thâm.",
    keyIngredients: [
      { name: "Centella Asiatica (Madecassoside)", role: "Kháng viêm mạnh mẽ, tái tạo mô da sau mụn" },
      { name: "Tinh dầu Tràm Trà lên men", role: "Khử khuẩn P.acnes nhẹ dịu không rát da" },
      { name: "BHA Tự Nhiên (Salix Alba)", role: "Thanh tẩy bã nhờn, làm thông thoáng lỗ chân lông" },
      { name: "Chiết xuất Diếp Cá & Trà Xanh", role: "Cân bằng tuyến dầu, giảm tiết nhờn đến 48%" }
    ],
    features: [
      "Hạ nhiệt ổ viêm mụn, giảm đỏ 80% chỉ sau 1 đêm sử dụng",
      "Kết cấu sợi dừa sinh học hút sạch cặn bã và dầu thừa trong lỗ chân lông",
      "Không gây bít tắc nhờ chất gel trong suốt siêu mỏng nhẹ",
      "Được kiểm nghiệm da liễu an toàn cho da mụn mủ, mụn trứng cá"
    ],
    usage: [
      "Bước 1: Làm sạch da nhẹ nhàng (tránh chà xát vùng có nốt mụn viêm).",
      "Bước 2: Đắp mặt nạ sinh học lên mặt sau khi gỡ lớp bảo vệ thứ nhất.",
      "Bước 3: Gỡ tiếp lớp lưới còn lại và thư giãn 30 phút.",
      "Bước 4: Không cần rửa lại với nước nếu ở môi trường máy lạnh; có thể lau nhẹ bằng toner."
    ],
    volume: "28ml / 1 miếng",
    origin: "Công nghệ sinh học Bio-Cellulose chuẩn cGMP"
  },
  {
    id: "bio-peptide-collagen",
    name: "Mặt Nạ Sinh Học Collagen Thủy Phân & Peptides Nâng Cơ Trẻ Hóa",
    subtitle: "Pro-Collagen & Multi-Peptide Firming Youth Bio-Mask",
    category: "anti-aging",
    skinTypes: ["aging", "dry", "normal"],
    price: 75000,
    originalPrice: 99000,
    rating: 4.9,
    reviewCount: 198,
    soldCount: 2200,
    badge: "Công Nghệ Nâng Cơ Y Khoa",
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80",
    description: "Liệu trình trẻ hóa tế bào tại nhà với phức hợp 6 loại Peptides trẻ hóa (Matrixyl 3000, Copper Tripeptide) và Collagen thủy phân cá biển sâu kích thước siêu vi 500Da. Lấp đầy rãnh nhăn nông quanh mắt, khóe miệng và tăng mật độ săn chắc da sau 4 tuần.",
    keyIngredients: [
      { name: "Collagen Biển Thủy Phân 500Da", role: "Hấp thụ sâu, tăng sinh liên kết elastin cho da đàn hồi" },
      { name: "Phức hợp 6-Peptides Tái Sinh", role: "Kích thích collagen tự thân, làm mờ rãnh cười và nếp nhăn trán" },
      { name: "Adenosine & Nấm Men Galactomyces", role: "Tăng tuần hoàn máu, giúp da hồng hào căng bóng" },
      { name: "Sợi Bio-Cellulose kéo căng cơ", role: "Tạo lực nâng vi mô kéo căng vùng má và cằm V-line" }
    ],
    features: [
      "Hiệu ứng căng bóng và săn chắc da cảm nhận được ngay sau khi tháo mặt nạ",
      "Kích thước phân tử collagen cực nhỏ thẩm thấu trực tiếp vào hạ bì",
      "Cải thiện độ đàn hồi da thêm 34% sau 28 ngày kiểm nghiệm lâm sàng",
      "Hương hoa mộc lan thanh khiết chuẩn liệu trình spa cao cấp"
    ],
    usage: [
      "Bước 1: Làm sạch da kỹ càng và thoa toner/serum lót.",
      "Bước 2: Đắp mặt nạ sinh học, dùng tay vuốt hướng lên thái dương để nâng cơ.",
      "Bước 3: Giữ mặt nạ trong 30-40 phút để collagen thẩm thấu triệt để.",
      "Bước 4: Tháo mặt nạ, massage nâng cơ từ cằm lên má trong 2 phút."
    ],
    volume: "30ml / 1 miếng",
    origin: "Công nghệ sinh học Bio-Cellulose chuẩn cGMP"
  },
  {
    id: "bio-combo-discovery",
    name: "Hộp Quà Cao Cấp Combo 10 Miếng Mặt Nạ Sinh Học BIOCELLA (Mix 4 Loại)",
    subtitle: "Complete Skin Transformation 10-Mask Luxury Gift Set",
    category: "combo",
    skinTypes: ["all", "dry", "oily", "aging", "sensitive"],
    price: 590000,
    originalPrice: 820000,
    rating: 5.0,
    reviewCount: 512,
    soldCount: 3800,
    badge: "Tiết Kiệm 230.000₫ + Tặng Băng Đô Spa",
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Bộ sưu tập mặt nạ sinh học toàn diện thiết kế trong hộp cứng nam châm dập kim sang trọng. Bao gồm: 3 miếng B5 Cấp ẩm phục hồi + 3 miếng Niacinamide Trắng sáng + 2 miếng Cica Giảm mụn + 2 miếng Peptide Trẻ hóa da. Tặng kèm băng đô nhung cao cấp cho quy trình skincare hoàn hảo.",
    keyIngredients: [
      { name: "Đầy đủ 4 công thức đỉnh cao", role: "Cung cấp trọn vẹn giải pháp: Dưỡng Ẩm - Trắng Sáng - Ngừa Mụn - Trẻ Hóa" },
      { name: "100% Nước dừa hữu cơ lên men", role: "Không chất bảo quản hóa học độc hại, thân thiện môi trường" },
      { name: "Tặng kèm Băng Đô Spa Cừu Cao Cấp", role: "Hỗ trợ cố định tóc gọn gàng khi đắp mặt nạ và skincare" }
    ],
    features: [
      "Giải pháp làm đẹp chuyên sâu theo chu kỳ tuần (2-3 lần/tuần)",
      "Thiết kế hộp quà ép kim vàng sang trọng, thích hợp làm quà tặng tinh tế",
      "Tiết kiệm hơn 28% so với mua lẻ từng miếng",
      "Miễn phí giao hàng hỏa tốc toàn quốc"
    ],
    usage: [
      "Thứ 2: Mặt nạ Cấp ẩm B5 để phục hồi độ ẩm sau tuần làm việc.",
      "Thứ 4: Mặt nạ Niacinamide dưỡng trắng và cải thiện sắc tố sạm.",
      "Thứ 6: Mặt nạ Cica thanh lọc da và làm dịu lỗ chân lông.",
      "Chủ Nhật: Mặt nạ Peptide Collagen trẻ hóa & nâng cơ đón tuần mới rạng rỡ."
    ],
    volume: "Hộp 10 miếng x 28ml/30ml",
    origin: "Sản phẩm chính hãng BIOCELLA đạt kiểm định Viện Da Liễu"
  },
  {
    id: "bio-aha-clay-pore",
    name: "Mặt Nạ Sinh Học Men Dừa Thanh Lọc Bã Nhờn & Thu Nhỏ Lỗ Chân Lông",
    subtitle: "Pore-Purifying Enzyme & Volcanic Mineral Bio-Cellulose Mask",
    category: "acne",
    skinTypes: ["oily", "acne", "normal"],
    price: 65000,
    originalPrice: 85000,
    rating: 4.8,
    reviewCount: 167,
    soldCount: 1850,
    badge: "Sạch Sâu Kiềm Dầu 24H",
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    description: "Sự kết hợp đột phá giữa cấu trúc màng vi sinh xốp nano và enzyme đu đủ hữu cơ tự nhiên cùng phức hợp AHA Lactic Acid 3%. Hút sạch dầu thừa cứng đầu sâu trong nang lông mà không hề gây khô căng rát mặt.",
    keyIngredients: [
      { name: "Enzyme Đu Đủ & AHA Lactic 3%", role: "Bẻ gãy liên kết da chết, kích thích tái tạo biểu bì mới" },
      { name: "Khoáng chất Tro Núi Lửa Jeju", role: "Hút bã nhờn, độc tố kim loại nặng và bụi mịn PM2.5" },
      { name: "Chiết xuất Cây Phỉ (Witch Hazel)", role: "Thu nhỏ lỗ chân lông và se khít bề mặt da tức thì" }
    ],
    features: [
      "Không làm khô ráp như mặt nạ đất sét thông thường nhờ màng dừa cấp ẩm",
      "Loại bỏ 92% dầu thừa và giảm mụn đầu đen sau 2 tuần",
      "Tạo cảm giác sảng khoái mát lạnh tức thì"
    ],
    usage: [
      "Bước 1: Rửa mặt bằng nước ấm để giãn nở lỗ chân lông.",
      "Bước 2: Đắp mặt nạ sinh học trong 20-25 phút.",
      "Bước 3: Gỡ mặt nạ và rửa sơ lại với nước mát để khóa chặt chân lông."
    ],
    volume: "28ml / 1 miếng",
    origin: "Công nghệ sinh học Bio-Cellulose chuẩn cGMP"
  }
];

// Dữ liệu đánh giá từ khách hàng thực tế
const REVIEWS_DATA = [
  {
    id: 1,
    name: "Bác Sĩ Da Liễu Thùy Dương",
    title: "Chuyên khoa Da liễu Thẩm mỹ - BV Da Liễu",
    avatar: "https://images.unsplash.com/photo-1594824813589-3221e5494cb8?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "12/09/2026",
    product: "Mặt Nạ Sinh Học B5 & Hyaluronic",
    comment: "Cấu trúc màng Bio-Cellulose dệt từ men nước dừa có độ tương thích sinh học lên tới 99% với da người. Tôi thường xuyên chỉ định bệnh nhân sau khi làm Fractional CO2 hoặc Peel TCA sử dụng loại mặt nạ này vì khả năng làm dịu và phục hồi tế bào tổn thương siêu việt mà không lo kích ứng."
  },
  {
    id: 2,
    name: "Ngọc Trâm (Beauty Blogger)",
    title: "Reviewer Chăm Sóc Da Nhạy Cảm",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "28/08/2026",
    product: "Combo 10 Miếng BIOCELLA Luxury Gift Set",
    comment: "Đắp mặt nạ giấy thông thường hay bị rớt hoặc khô cong sau 15 phút, nhưng mask sinh học của BIOCELLA này dính chặt như lớp da thứ hai luôn! Mình vừa đắp vừa dọn nhà, làm việc thoải mái. Đắp xong da bóng bẩy căng mọng nước như vừa tiêm meso ở clinic vậy!"
  },
  {
    id: 3,
    name: "Phương Thảo",
    title: "Khách hàng thân thiết (28 tuổi, TP.HCM)",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "01/10/2026",
    product: "Mặt Nạ Sinh Học Rau Má Centella Giảm Mụn",
    comment: "Đợt trước mình bị bùng mụn do stress thức khuya, mặt đỏ ửng kinh khủng. Đắp thử 1 miếng Cica này để trong tủ lạnh, hôm sau vết mụn gom cồi và xẹp thấy rõ, không còn cảm giác đau nhức. Đã mua lại hộp thứ 3 rồi ạ!"
  }
];

// Bài test chẩn đoán da cá nhân hóa
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Tình trạng da hiện tại của bạn cảm thấy như thế nào nhất?",
    options: [
      { text: "Khô căng, bong tróc nứt nẻ, thiếu ẩm trầm trọng", target: "dry" },
      { text: "Đổ nhiều dầu nhờn vùng chữ T, nhiều mụn viêm hoặc mụn ẩn", target: "acne" },
      { text: "Xỉn màu, thâm sạm sau mụn, không đều màu và thiếu sức sống", target: "dull" },
      { text: "Bắt đầu xuất hiện nếp nhăn đuôi mắt, khóe miệng, da chùng nhão", target: "aging" },
      { text: "Đang điều trị laser/peel hoặc da cực kỳ nhạy cảm dễ ửng đỏ", target: "treatment" }
    ]
  },
  {
    id: 2,
    question: "Bạn mong muốn đạt được hiệu quả cải thiện da nào nhất trong 2 tuần tới?",
    options: [
      { text: "Căng bóng ngậm nước như gái Hàn, làm dịu tức thì", target: "recovery" },
      { text: "Hết thâm mụn, da sáng bừng và đều màu rạng rỡ", target: "brightening" },
      { text: "Gom cồi mụn nhanh, kiềm dầu và thông thoáng lỗ chân lông", target: "acne" },
      { text: "Săn chắc cơ mặt, nâng cơ và mờ nếp nhăn lão hóa", target: "anti-aging" }
    ]
  },
  {
    id: 3,
    question: "Tần suất đắp mặt nạ trong tuần của bạn là bao nhiêu?",
    options: [
      { text: "Người mới bắt đầu, 1 lần/tuần", comboPreference: "single" },
      { text: "Chăm chỉ đều đặn, 2 - 3 lần/tuần (Liệu trình chuẩn spa)", comboPreference: "combo" },
      { text: "Hằng ngày để phục hồi da treatment cấp tốc", comboPreference: "intensive" }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, REVIEWS_DATA, QUIZ_QUESTIONS };
}
