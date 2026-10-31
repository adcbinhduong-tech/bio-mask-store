-- ====================================================================
-- BIOCELLA STORE - INITIAL SEED DATA
-- ====================================================================

USE `biocella_db`;

-- 1. SEED SẢN PHẨM MẶT NẠ MEN DỪA
INSERT INTO `products` (`id`, `name`, `subtitle`, `category`, `skin_types`, `price`, `original_price`, `rating`, `review_count`, `sold_count`, `badge`, `is_bestseller`, `image`, `description`, `key_ingredients`, `features`, `usage_steps`, `volume`, `origin`)
VALUES
(
  'bio-b5-hydra',
  'Mặt Nạ Sinh Học B5 & Hyaluronic Cấp Ẩm Phục Hồi Chuyên Sâu',
  'Deep Moisture & Barrier Repair Bio-Cellulose Mask',
  'recovery',
  '["dry", "sensitive", "treatment"]',
  65000,
  85000,
  4.9,
  328,
  4200,
  'Bán Chạy Nhất',
  TRUE,
  'https://images.unsplash.com/photo-1608248597359-5f21297b4ec0?auto=format&fit=crop&w=800&q=80',
  'Mặt nạ sợi sinh học dệt từ 100% nước dừa tươi lên men nguyên chất, ngậm đẫm 28ml tinh chất Vitamin B5 (Panthenol 5%), 5 loại Hyaluronic Acid đa phân tử và Ceramide NP. Khóa ẩm tức thì, làm dịu da cháy nắng, phục hồi hàng rào bảo vệ da sau laser/peel.',
  '[{"name": "Vitamin B5 (Panthenol 5%)", "role": "Phục hồi tổn thương mô da & giảm đỏ tức thì"}, {"name": "5D Hyaluronic Acid", "role": "Cấp ẩm đa tầng từ biểu bì đến hạ bì"}, {"name": "Ceramide NP & Ectoin", "role": "Củng cố màng lipid, chống mất nước xuyên biểu bì"}, {"name": "Nước dừa Bến Tre lên men", "role": "Sợi nano 20nm ôm khít từng nếp nhăn, làm dịu mát tự nhiên"}]',
  '["Màng cellulose nano siêu mỏng chỉ 0.2mm, ôm khít 100% đường cong gương mặt", "Khả năng hấp thụ và thẩm thấu dưỡng chất gấp 20 lần mặt nạ giấy thông thường", "Làm mát da lập tức -3°C ngay khi đắp, không gây bí rít hay kích ứng", "An toàn tuyệt đối cho cả phụ nữ mang thai và làn da sau điều trị thẩm mỹ"]',
  '["Bước 1: Rửa mặt sạch và cân bằng da với toner dịu nhẹ.", "Bước 2: Gỡ bỏ 1 lớp màng lưới bảo vệ, áp nhẹ nhàng mặt nạ sinh học ôm khít khuôn mặt.", "Bước 3: Gỡ tiếp lớp lưới bảo vệ thứ 2, điều chỉnh để mặt nạ bám sát toàn bộ gương mặt.", "Bước 4: Thư giãn 25 - 40 phút (không bị hút ẩm ngược như mask giấy). Tháo ra và vỗ nhẹ dưỡng chất."]',
  '28ml / 1 miếng',
  'Công nghệ sinh học Bio-Cellulose chuẩn cGMP'
),
(
  'bio-glow-niacinamide',
  'Mặt Nạ Sinh Học Niacinamide 10% & Arbutin Trắng Hồng Mờ Thâm',
  'Radiance Brightening & Dark Spot Corrector Bio-Mask',
  'brightening',
  '["dull", "oily", "normal"]',
  69000,
  90000,
  4.8,
  254,
  3100,
  'Mờ Thâm Sau 7 Ngày',
  TRUE,
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  'Giải pháp ức chế melanin tối ưu với công thức phức hợp Niacinamide tinh khiết 10%, Alpha Arbutin và Glutathione bọc liposome. Dưỡng da trắng trong veo, làm đều màu các vết thâm sau mụn và đem lại hiệu ứng căng bóng chuẩn Glass Skin Hàn Quốc.',
  '[{"name": "Niacinamide 10% Tinh Khiết", "role": "Mờ thâm mụn, se khít lỗ chân lông, kiềm dầu"}, {"name": "Alpha Arbutin & Glutathione", "role": "Ức chế tyrosinase hình thành sắc tố sạm nám"}, {"name": "Chiết xuất Hoa Cúc La Mã", "role": "Làm dịu, chống oxy hóa và ngừa kích ứng"}, {"name": "Màng Bio-Cellulose dừa", "role": "Dẫn truyền hoạt chất làm trắng sâu vào tế bào"}]',
  '["Cải thiện độ sáng và đều màu da rõ rệt chỉ sau 3 lần đắp", "Không chứa cồn, không hương liệu tổng hợp, không paraben", "Cung cấp dưỡng chất nuôi dưỡng sắc tố da hồng hào tự nhiên", "Khả năng bám dính chắc chắn, thoải mái vận động làm việc khi đắp"]',
  '["Bước 1: Làm sạch da mặt với nước tẩy trang và sữa rửa mặt.", "Bước 2: Mở gói, tách 1 lớp lưới định hình và đắp lớp màng sinh học lên mặt.", "Bước 3: Lột bỏ lớp lưới còn lại, vuốt nhẹ cho màng ôm khít.", "Bước 4: Đắp 30 phút, gỡ bỏ và massage phần tinh chất còn dư cho vùng cổ."]',
  '28ml / 1 miếng',
  'Công nghệ sinh học Bio-Cellulose chuẩn cGMP'
),
(
  'bio-cica-acne',
  'Mặt Nạ Sinh Học Rau Má Centella & Tràm Trà Kháng Viêm Giảm Mụn',
  'Soothing Cica & Tea Tree Blemish Calming Bio-Mask',
  'acne',
  '["oily", "acne", "sensitive"]',
  62000,
  80000,
  4.9,
  412,
  5600,
  'Khuyên Dùng Cho Da Mụn',
  TRUE,
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  'Cứu tinh cho làn da dầu mụn sưng viêm, bít tắc chân lông hoặc sau khi nặn mụn. Chiết xuất Centella Asiatica 85% kết hợp tràm trà hữu cơ chưng cất và BHA Salicylic Acid tự nhiên từ vỏ cây liễu trắng giúp tiêu viêm, xẹp mụn và ngăn ngừa sẹo thâm.',
  '[{"name": "Centella Asiatica (Madecassoside)", "role": "Kháng viêm mạnh mẽ, tái tạo mô da sau mụn"}, {"name": "Tinh dầu Tràm Trà lên men", "role": "Khử khuẩn P.acnes nhẹ dịu không rát da"}, {"name": "BHA Tự Nhiên (Salix Alba)", "role": "Thanh tẩy bã nhờn, làm thông thoáng lỗ chân lông"}, {"name": "Chiết xuất Diếp Cá & Trà Xanh", "role": "Cân bằng tuyến dầu, giảm tiết nhờn đến 48%"}]',
  '["Giảm sưng đỏ nốt mụn rõ rệt chỉ sau 1 đêm đắp qua đêm", "Kiểm soát bã nhờn và ngăn ngừa mụn mới bùng phát", "Kết cấu màng dừa tự nhiên giúp làm dịu cảm giác ngứa ngáy khó chịu", "Không gây kích ứng hay khô căng sau khi đắp"]',
  '["Bước 1: Làm sạch da với sữa rửa mặt dịu nhẹ độ pH 5.5.", "Bước 2: Đắp màng sinh học lên mặt, điều chỉnh vị trí mắt, mũi, miệng.", "Bước 3: Tháo lớp lưới bên ngoài, vuốt đều để màng bám chặt.", "Bước 4: Đắp 30 - 35 phút, không cần rửa lại với nước."]',
  '28ml / 1 miếng',
  'Công nghệ sinh học Bio-Cellulose chuẩn cGMP'
),
(
  'bio-peptides-lifting',
  'Mặt Nạ Sinh Học Phức Hợp 9-Peptides & Collagen Chống Lão Hóa',
  'Anti-Aging 9-Peptide Complex & Marine Collagen Firming Mask',
  'antiaging',
  '["aging", "dry", "normal"]',
  75000,
  98000,
  4.9,
  189,
  2400,
  'Nâng Cơ Chuyên Sâu',
  FALSE,
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  'Liệu pháp săn chắc và xóa mờ rãnh cười dành cho da bắt đầu xuất hiện dấu hiệu lão hóa hoặc chùng nhão. Phức hợp 9 chuỗi Peptides kết hợp Marine Collagen siêu phân tử giúp kích thích sản sinh collagen nội sinh, tăng mật độ đàn hồi cho da.',
  '[{"name": "Phức hợp 9-Peptides Bio", "role": "Kích thích nguyên bào sợi sản sinh elastin & collagen"}, {"name": "Marine Collagen Thủy Phân", "role": "Lấp đầy các rãnh nhăn nông quanh mắt và khóe miệng"}, {"name": "Adenosine 0.04%", "role": "Phục hồi cấu trúc nền da săn chắc tự nhiên"}, {"name": "Màng Bio-Cellulose dừa", "role": "Tạo áp lực nén thẩm thấu dưỡng chất nâng cơ mặt"}]',
  '["Cải thiện độ đàn hồi và săn chắc cơ mặt sau 2 tuần sử dụng", "Màng sinh học dừa đàn hồi cao giúp ôm khít cằm và viền hàm V-line", "Cung cấp độ ẩm dồi dào, xóa mờ nếp nhăn khô", "Thích hợp cho phụ nữ từ 25 tuổi trở lên"]',
  '["Bước 1: Làm sạch da mặt và thoa serum chống lão hóa (nếu có).", "Bước 2: Đắp mặt nạ sinh học theo chiều nâng cơ từ cằm lên thái dương.", "Bước 3: Thư giãn trong 35 - 45 phút để dưỡng chất thẩm thấu trọn vẹn.", "Bước 4: Gỡ mặt nạ, dùng các đầu ngón tay nâng nhẹ cơ mặt."]',
  '28ml / 1 miếng',
  'Công nghệ sinh học Bio-Cellulose chuẩn cGMP'
),
(
  'bio-cica-post-laser',
  'Mặt Nạ Sinh Học Cứu Cánh Làn Da Tổn Thương Sau Laser & Peel',
  'Post-Treatment Intensive Soothing & Skin Rebirth Bio-Mask',
  'recovery',
  '["treatment", "sensitive", "dry"]',
  79000,
  105000,
  5.0,
  215,
  1850,
  'Chuẩn Y Khoa Spa',
  FALSE,
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  'Dòng mặt nạ chuyên dụng tại các phòng khám da liễu và spa thẩm mỹ cao cấp. Được tiệt trùng bằng tia Gamma chuẩn y tế, hoàn toàn vô trùng, chứa hàm lượng cao EGF (Yếu tố tăng trưởng biểu bì) và D-Panthenol 7% giúp cấp tốc làm dịu cảm giác bỏng rát sau trị liệu.',
  '[{"name": "EGF & FGF Y Khoa", "role": "Thúc đẩy tốc độ lành thương và tái sinh mô da mới"}, {"name": "D-Panthenol 7% Dược Dụng", "role": "Dập tắt cảm giác châm chích, nóng rát chỉ sau 10 phút"}, {"name": "Madecassoside Tinh Khiết", "role": "Ngừa sẹo thâm và ngăn tăng sắc tố sau viêm (PIH)"}, {"name": "Màng dừa vô trùng Gamma", "role": "Hạ nhiệt độ bề mặt da tức thì -4.5°C an toàn tuyệt đối"}]',
  '["Tiệt trùng bằng tia Gamma tiêu chuẩn phòng mổ y khoa", "Dịu ngay cảm giác châm chích, đỏ rát sau lăn kim, phi kim, laser", "Rút ngắn thời gian phục hồi da từ 5 ngày xuống còn 48 giờ", "Được tin dùng bởi hơn 120 bác sĩ da liễu toàn quốc"]',
  '["Bước 1: Giữ mặt nạ trong ngăn mát tủ lạnh 10 phút trước khi dùng.", "Bước 2: Sau bước điều trị, nhẹ nhàng áp mặt nạ lên vùng da đỏ rát.", "Bước 3: Giữ nguyên lớp mặt nạ trong 30 - 40 phút để hạ nhiệt da.", "Bước 4: Không cần rửa lại, thoa thêm kem dưỡng phục hồi chuyên sâu."]',
  '30ml / 1 miếng',
  'Công nghệ sinh học Bio-Cellulose chuẩn cGMP'
),
(
  'bio-combo-discovery',
  'Hộp Quà Cao Cấp Combo 10 Miếng BIOCELLA Trải Nghiệm Toàn Diện',
  'Full Discovery Experience Box - 10 Bio-Cellulose Masks',
  'combo',
  '["normal", "dry", "oily", "sensitive", "treatment"]',
  590000,
  800000,
  5.0,
  540,
  3800,
  'Tiết Kiệm 210K + Hộp Quà',
  TRUE,
  'https://images.unsplash.com/photo-1512290900672-1f55b9a7106c?auto=format&fit=crop&w=800&q=80',
  'Hộp quà sang trọng thiết kế độc quyền với 10 miếng mặt nạ sinh học men dừa đầy đủ các dòng: 3 B5 Cấp Ẩm, 3 Niacinamide Trắng Da, 2 Rau Má Giảm Mụn và 2 Peptides Trẻ Hóa. Tặng kèm túi vải canvas hữu cơ cao cấp và hướng dẫn lộ trình chăm sóc chuẩn chuyên gia.',
  '[{"name": "10 Mặt nạ Bio-Cellulose", "role": "Đầy đủ 4 công năng: Cấp ẩm, Trắng da, Trị mụn, Chống lão hóa"}, {"name": "100% Nước Dừa Bến Tre", "role": "Mỗi chiếc mặt nạ tương đương dưỡng chất từ 1 quả dừa tươi"}, {"name": "Túi Canvas Sinh Học", "role": "Quà tặng thân thiện môi trường chuẩn sống xanh"}]',
  '["Tiết kiệm ngay 210.000đ so với mua lẻ từng miếng", "Tặng kèm thiệp viết tay và hộp quà nam châm sang trọng", "Freeship hỏa tốc toàn quốc", "Phù hợp làm quà tặng cao cấp cho người thân, bạn bè"]',
  '["Tuần 1: Cấp ẩm B5 & Thanh lọc Rau má 3 lần/tuần.", "Tuần 2: Phục hồi B5 & Niacinamide làm sáng 3 lần/tuần.", "Tuần 3 & 4: Nâng cơ Peptide xen kẽ dưỡng sáng da."]',
  'Hộp 10 miếng (28ml x 10)',
  'Công nghệ sinh học Bio-Cellulose chuẩn cGMP'
)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `price`=VALUES(`price`);

-- 2. SEED ĐƠN HÀNG DEMO (ORDERS)
INSERT INTO `orders` (`id`, `customer_name`, `customer_phone`, `customer_city`, `customer_address`, `customer_note`, `payment_method`, `status`, `subtotal`, `discount`, `shipping_fee`, `total_amount`, `items`, `created_at`)
VALUES
(
  'BC-839210',
  'Nguyễn Thị Ngọc Mai',
  '0982345678',
  'Hà Nội',
  'Số 45 Tràng Tiền, Hoàn Kiếm',
  'Giao trong giờ hành chính giúp mình',
  'vietqr',
  'completed',
  590000,
  59000,
  0,
  531000,
  '[{"id": "bio-combo-discovery", "name": "Hộp Quà Cao Cấp Combo 10 Miếng BIOCELLA", "price": 590000, "quantity": 1}]',
  '2026-10-02 14:25:00'
),
(
  'BC-718293',
  'Trần Minh Quân',
  '0918765432',
  'Đà Nẵng',
  'K120/15 Lê Duẩn, Hải Châu',
  'Gọi trước khi giao 15p',
  'cod',
  'shipping',
  384000,
  0,
  0,
  384000,
  '[{"id": "bio-b5-hydra", "name": "Mặt Nạ Sinh Học B5 & Hyaluronic Cấp Ẩm", "price": 65000, "quantity": 4}, {"id": "bio-cica-acne", "name": "Mặt Nạ Sinh Học Rau Má Centella Giảm Mụn", "price": 62000, "quantity": 2}]',
  '2026-10-03 09:12:00'
),
(
  'BC-629104',
  'Phạm Thu Hương',
  '0934567890',
  'TP. Hồ Chí Minh',
  '28/4 Thảo Điền, Quận 2',
  '',
  'vietqr',
  'pending',
  207000,
  0,
  30000,
  237000,
  '[{"id": "bio-glow-niacinamide", "name": "Mặt Nạ Sinh Học Niacinamide 10% & Arbutin Trắng Hồng", "price": 69000, "quantity": 3}]',
  '2026-10-03 11:40:00'
)
ON DUPLICATE KEY UPDATE `customer_name`=VALUES(`customer_name`);

-- 3. SEED MÃ KHUYẾN MÃI (VOUCHERS)
INSERT INTO `vouchers` (`code`, `type`, `value`, `min_order`, `label`, `is_active`)
VALUES
('BIOCELLA10', 'percent', 10, 0, 'Giảm 10% tổng đơn', TRUE),
('FREESHIP', 'fixed', 30000, 0, 'Trợ giá ship 30.000đ', TRUE),
('SKINTEST15', 'percent', 15, 0, 'Quà tặng Trắc Nghiệm Da - Giảm 15%', TRUE),
('SPA50K', 'fixed', 50000, 300000, 'Giảm 50.000đ cho đơn từ 300k', TRUE)
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`);

-- 4. SEED CÀI ĐẶT NỘI DUNG WEBSITE (SITE_SETTINGS)
INSERT INTO `site_settings` (`id`, `brand_name`, `brand_slogan`, `announcement_text`, `shipping_notice`, `free_shipping_threshold`, `hotline`, `hero_title`, `hero_desc`, `bank_id`, `bank_account`, `bank_owner`)
VALUES
(
  1,
  'BIOCELLA',
  'BIO-CELLULOSE LAB',
  '🎁 ƯU ĐÃI THÁNG MỚI: Nhập mã BIOCELLA10 giảm ngay 10% đơn đầu tiên',
  '🚚 Miễn phí vận chuyển toàn quốc cho đơn hàng từ 350.000đ',
  350000,
  '1900 6828',
  'Đánh Thức Làn Da Tái Sinh Cùng Mặt Nạ Men Dừa Chuẩn Y Khoa',
  'Dệt từ 100% nước dừa tươi Bến Tre lên men tự nhiên. Màng sợi sinh học Bio-Cellulose nano 20nm ôm khít như làn da thứ hai, đưa dưỡng chất thẩm thấu sâu gấp 20 lần mặt nạ giấy thông thường.',
  'MB',
  '0988776655',
  'CONG TY BIOCELLA VIET NAM'
)
ON DUPLICATE KEY UPDATE `brand_name`=VALUES(`brand_name`);

-- 5. SEED TÀI KHOẢN QUẢN TRỊ ADMIN (Mật khẩu: admin123)
INSERT INTO `admins` (`id`, `username`, `password`, `email`, `full_name`)
VALUES
(
  1,
  'admin',
  'admin123',
  'admin@biocella.vn',
  'Quản Trị Viên Hệ Thống'
)
ON DUPLICATE KEY UPDATE `username`=VALUES(`username`);
