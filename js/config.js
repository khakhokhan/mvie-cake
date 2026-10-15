// M'Vie Cake - Full Site Configuration & Default State

const DEFAULT_CONFIG = {
  site: {
    browserTitle: "M’Vie Cake - Tiệm Gato Flan, Panna Cotta & Cupcake | Thuận An",
    metaDesc: "M'Vie Cake chuyên Gato Flan (Choco, Matcha), Panna Cotta thơm mát, Flan truyền thống, Cupcake và bánh trang trí sinh nhật theo yêu cầu tại An Thạnh 73, Thuận An.",
    topAnnouncement: "M'Vie Cake: Chuyên Gato Flan, Panna Cotta, Cupcake & Bánh Sinh Nhật Theo Yêu Cầu • An Thạnh 73, Thuận An",
    announcementSub: "Vui lòng đặt trước 1-2 ngày để shop chuẩn bị chu đáo nhất"
  },
  theme: {
    primaryColor: "#9BC7E8",
    primaryHover: "#82b9df",
    accentYellow: "#FEF08A",
    accentPink: "#FDA4AF",
    backgroundColor: "#EEF7FD", // Tone xanh dương pastel dịu ngọt
    textColor: "#2D231E",
    cardColor: "#FFFFFF",
    dnaEnabled: true,
    dnaAutoPlay: true,
    dnaSpeed: 0.22,
    // Framer AisolRippleDots Component
    rippleDotsEnabled: true,
    rippleDotsBg: "#EEF7FD",      // Tone nền xanh dương pastel
    rippleDotsColor: "#FDE047",   // Chấm vàng pastel ngọt ngào
    rippleDotsSpacing: 28,
    rippleDotsSize: 2.8,
    rippleDotsReach: 160,
    rippleDotsStrength: 0.75,
    rippleDotsTapRing: true
  },
  store: {
    name: "M’Vie Cake",
    tagline: "Gato Flan • Panna Cotta • Cupcake",
    badgeText: "Homemade",
    logoUrl: "assets/logo.jpg",
    hotline: "0909 xxx xxx",
    address: "An Thạnh 73, Thuận An, Bình Dương / TP. HCM",
    facebookUrl: "https://www.facebook.com/profile.php?id=61589434797320",
    messengerUrl: "https://m.me/61589434797320",
    workingHours: "08:00 - 21:00 hàng ngày (Nhận order trước 1-2 ngày)",
    shippingNote: "Bánh Flan, Gato Flan và Panna Cotta được bảo quản cẩn thận trong túi giữ nhiệt để giữ trọn độ mát lạnh khi giao đến tay bạn."
  },
  hero: {
    badge: "Tiệm Bánh Homemade M’Vie Cake • An Thạnh 73, Thuận An",
    titleLine1: "Gato Flan Béo Ngậy,",
    titleHighlight: "Panna Cotta & Cupcake",
    titleLine2: "Tươi Mỗi Ngày",
    subtitle: "Mời bạn thưởng thức những món tráng miệng homemade ngọt dịu đặc trưng của M’Vie Cake: Gato Flan đậm vị Choco & Matcha, Panna Cotta hũ sốt trái cây tươi mát, Bánh Flan truyền thống béo mịn và Set Cupcake xinh xắn.",
    heroImage: "assets/gato-flan-choco.jpg",
    heroImageBadge: "Món Tủ Signature",
    heroImageTitle: "Gato Flan Choco & Matcha",
    heroImageSubtitle: "Size nhỏ 30k - 35k • Ổ lớn sinh nhật 160k - 200k",
    ctaPrimaryText: "Xem Menu & Bảng Giá",
    ctaSecondaryText: "Đặt Bánh Sinh Nhật Custom",
    policyTitle: "Lưu ý đặt bánh từ M'Vie Cake:",
    policyNote: "• Đối với bánh trang trí sinh nhật, giá có thể thay đổi tùy theo mẫu trang trí và yêu cầu riêng của khách hàng.<br>• Bạn vui lòng <strong>đặt bánh trước 1-2 ngày</strong> để shop chuẩn bị chu đáo hơn cho mình ạ!"
  },
  categories: [
    { id: "all", name: "Tất Cả Món" },
    { id: "gatoflan", name: "Gato Flan (Choco & Matcha)" },
    { id: "pannacotta", name: "Panna Cotta (Hũ 50ml & 120ml)" },
    { id: "flan", name: "Bánh Flan (Set 10 Cái)" },
    { id: "cupcake", name: "Set Cupcake Decor" },
    { id: "birthday", name: "Bánh Sinh Nhật Custom" }
  ],
  products: [
    {
      id: 1,
      name: "Gato Flan Choco",
      category: "gatoflan",
      badge: "Món Tủ Nhà M'Vie",
      badgeColor: "bg-amber-100 text-amber-900",
      image: "assets/gato-flan-choco.jpg",
      desc: "Sự kết hợp hoàn hảo giữa lớp flan caramel béo ngậy mềm mịn và cốt gato sô-cô-la xốp mềm thơm lừng.",
      options: [
        { name: "Size Nhỏ (1 cái)", price: 30000 },
        { name: "Size Lớn (Ổ tiệc / sinh nhật)", price: 160000 }
      ],
      defaultPrice: 30000,
      unit: "cái",
      note: "Vị sô-cô-la đậm đà kết hợp flan núng nính",
      isAvailable: true
    },
    {
      id: 2,
      name: "Gato Flan Matcha",
      category: "gatoflan",
      badge: "Thơm Vị Trà",
      badgeColor: "bg-emerald-100 text-emerald-900",
      image: "assets/cake-matcha.jpg",
      desc: "Lớp flan trứng vàng óng ngọt dịu hòa quyện cùng cốt bông lan trà xanh thanh mát, béo nhẹ không ngán.",
      options: [
        { name: "Size Nhỏ (1 cái)", price: 30000 },
        { name: "Size Lớn (Ổ tiệc / sinh nhật)", price: 180000 }
      ],
      defaultPrice: 30000,
      unit: "cái",
      note: "Vị thanh mát của trà xanh, ít ngọt béo dịu",
      isAvailable: true
    },
    {
      id: 3,
      name: "Gato Flan Full Matcha",
      category: "gatoflan",
      badge: "Đặc Biệt",
      badgeColor: "bg-teal-100 text-teal-900",
      image: "assets/cake-matcha.jpg",
      desc: "Nhân đôi vị trà xanh từ lớp flan matcha mịn mượt tới cốt gato trà xanh bồng bềnh, thơm nức mũi chuẩn gu.",
      options: [
        { name: "Size Nhỏ (1 cái)", price: 35000 },
        { name: "Size Lớn (Ổ tiệc / sinh nhật)", price: 200000 }
      ],
      defaultPrice: 35000,
      unit: "cái",
      note: "Dành riêng cho tín đồ matcha thứ thiệt",
      isAvailable: true
    },
    {
      id: 4,
      name: "Bánh Flan Caramel Truyền Thống",
      category: "flan",
      badge: "Set 10 Flan",
      badgeColor: "bg-yellow-100 text-yellow-900",
      image: "assets/flan-caramel.jpg",
      desc: "Bánh flan mềm mịn không rỗ, thơm lừng mùi trứng sữa tươi hòa cùng sốt caramel cà phê đắng ngọt cân bằng tuyệt hảo.",
      options: [
        { name: "Set 10 Flan (10 cái)", price: 85000 }
      ],
      defaultPrice: 85000,
      unit: "set",
      note: "Chỉ 8.5k/cái khi mua cả set 10",
      isAvailable: true
    },
    {
      id: 5,
      name: "Panna Cotta Hũ 50ml (Size Nhỏ)",
      category: "pannacotta",
      badge: "Thanh Mát",
      badgeColor: "bg-sky-100 text-sky-900",
      image: "assets/panna-cotta.jpg",
      desc: "Tráng miệng kem sữa Ý núng nính, mềm tan ngay đầu lưỡi phủ các loại sốt trái cây tươi chua ngọt hấp dẫn.",
      options: [
        { name: "1 Hũ lẻ 50ml", price: 8000 },
        { name: "Set 6 hũ 50ml", price: 45000 },
        { name: "Set 10 hũ 50ml", price: 75000 },
        { name: "Set 20 hũ 50ml (Tiệc / Hội họp)", price: 150000 }
      ],
      defaultPrice: 8000,
      unit: "hũ",
      note: "Có các vị sốt: Dâu, Xoài, Việt Quất, Kiwi, Matcha",
      isAvailable: true
    },
    {
      id: 6,
      name: "Panna Cotta Hũ 120ml (Size Lớn)",
      category: "pannacotta",
      badge: "Ăn Cực Đã",
      badgeColor: "bg-blue-100 text-blue-900",
      image: "assets/panna-cotta-jars.jpg",
      desc: "Hũ dung tích lớn 120ml đầy đặn, phủ lớp mứt sốt hoa quả tươi nguyên chất mát lạnh sảng khoái.",
      options: [
        { name: "1 Hũ lẻ 120ml", price: 12000 },
        { name: "Set 6 hũ 120ml", price: 65000 },
        { name: "Set 10 hũ 120ml", price: 110000 },
        { name: "Set 20 hũ 120ml (Tiệc / Hội họp)", price: 230000 }
      ],
      defaultPrice: 12000,
      unit: "hũ",
      note: "Có các vị sốt: Dâu, Xoài, Việt Quất, Kiwi, Matcha",
      isAvailable: true
    },
    {
      id: 7,
      name: "Cupcake Trang Trí Kem Xinh Xắn",
      category: "cupcake",
      badge: "Set Quà Tặng",
      badgeColor: "bg-pink-100 text-pink-900",
      image: "assets/cupcake-set.jpg",
      desc: "Cốt bánh bông lan bơ sữa xốp mịn, bắt kem tạo hình hoa nhí hoặc decor cute tone pastel siêu yêu cho tiệc trà.",
      options: [
        { name: "Set 4 bánh", price: 110000 },
        { name: "Set 6 bánh", price: 165000 },
        { name: "Set 9 bánh", price: 240000 },
        { name: "Set 12 bánh", price: 310000 }
      ],
      defaultPrice: 110000,
      unit: "set",
      note: "Đóng hộp thắt nơ xinh xắn kèm nến",
      isAvailable: true
    },
    {
      id: 8,
      name: "Bánh Trang Trí Sinh Nhật Theo Yêu Cầu",
      category: "birthday",
      badge: "Đặt Trước 1-2 Ngày",
      badgeColor: "bg-rose-100 text-rose-900",
      image: "assets/logo.jpg",
      desc: "M'Vie Cake nhận thiết kế bánh kem sinh nhật, bánh bento hoặc ổ Gato Flan trang trí theo mẫu riêng của bạn.",
      options: [
        { name: "Bánh Sinh Nhật Custom (Giá theo mẫu riêng)", price: 160000 }
      ],
      defaultPrice: 160000,
      unit: "ổ",
      note: "Giá có thể thay đổi tùy mẫu trang trí & yêu cầu riêng của khách hàng",
      isAvailable: true
    }
  ],
  about: {
    badge: "Câu Chuyện Tiệm Bánh",
    title: "Vì Sao Khách Hàng Yêu Thích M’Vie Cake?",
    desc: "Xuất phát từ niềm đam mê tạo nên những chiếc bánh ngọt lành cho những người thân yêu, M’Vie Cake luôn giữ trọn cam kết: mỗi chiếc bánh ra lò là một tác phẩm được nâng niu trọn vẹn từ chất lượng bên trong đến vẻ đẹp bên ngoài.",
    image: "assets/baking-process.jpg",
    features: [
      {
        icon: "assets/icons/milk-bottle.png",
        title: "Nguyên Liệu Tuyển Chọn",
        desc: "100% bơ lạt động vật, sữa tươi nguyên kem, trứng gà tươi sạch nướng mới mỗi ngày."
      },
      {
        icon: "assets/icons/heart.png",
        title: "Giảm 40% Độ Ngọt",
        desc: "Công thức bánh ít ngọt thanh nhẹ độc quyền, không gây ngấy ngán cho cả gia đình."
      },
      {
        icon: "assets/icons/chef-hat.png",
        title: "Nướng Mới Mỗi Ngày",
        desc: "Bánh chỉ làm theo từng mẻ đặt hàng, đảm bảo luôn giữ trọn độ ẩm mịn bồng bềnh."
      },
      {
        icon: "assets/icons/gift.png",
        title: "Đóng Gói Chu Đáo",
        desc: "Hộp đẹp, kèm muỗng nĩa nến và túi giữ nhiệt bảo quản bánh mát lạnh khi giao."
      }
    ]
  },
  feedbacks: [
    {
      id: 1,
      name: "Minh Hằng",
      location: "Thuận An, Bình Dương",
      avatar: "MH",
      stars: 5,
      content: "Gato Flan Choco ở đây đỉnh chóp luôn! Lớp flan béo ngậy mềm mượt, cốt gato socola mềm tan không bị khô hay ngọt gắt. Cả nhà mình ai ăn cũng khen."
    },
    {
      id: 2,
      name: "Thảo Vy",
      location: "An Thạnh, Thuận An",
      avatar: "TV",
      stars: 5,
      content: "Panna cotta hũ 120ml ăn siêu đã, sốt dâu và sốt xoài chua chua ngọt ngọt thơm nức mũi. Mình mua combo 10 hũ để đãi tiệc sinh nhật ai cũng xin địa chỉ mua."
    },
    {
      id: 3,
      name: "Đăng Khoa",
      location: "TP. Hồ Chí Minh",
      avatar: "ĐK",
      stars: 5,
      content: "Set 4 cupcake decor xinh xỉu làm quà tặng bạn gái ưng ý hết nấc. Shop chu đáo, đóng hộp thắt nơ cẩn thận. Bánh Flan 10 cái 85k cũng rất ngon và rẻ."
    }
  ]
};

// Utilities to load/save full config
function getFullConfig() {
  const saved = localStorage.getItem('mvie_full_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Merge with default in case new fields were added
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        site: { ...DEFAULT_CONFIG.site, ...(parsed.site || {}) },
        theme: { ...DEFAULT_CONFIG.theme, ...(parsed.theme || {}) },
        store: { ...DEFAULT_CONFIG.store, ...(parsed.store || {}) },
        hero: { ...DEFAULT_CONFIG.hero, ...(parsed.hero || {}) },
        about: { ...DEFAULT_CONFIG.about, ...(parsed.about || {}) },
        categories: parsed.categories || DEFAULT_CONFIG.categories,
        products: parsed.products || DEFAULT_CONFIG.products,
        feedbacks: parsed.feedbacks || DEFAULT_CONFIG.feedbacks
      };
    } catch (e) {
      console.error("Failed to parse config, using default", e);
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

function saveFullConfig(cfg) {
  localStorage.setItem('mvie_full_config', JSON.stringify(cfg));
}

function resetFullConfig() {
  localStorage.removeItem('mvie_full_config');
  localStorage.removeItem('mvie_custom_products');
  localStorage.removeItem('mvie_store_settings');
}

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}
