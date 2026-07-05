// Raw mock dataset representing database representations of products, categories, brands, and reviews.

export interface RawProduct {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  salePrice?: number;
  imageUrls: string[];
  categoryId: string;
  brandId?: string;
  sku: string;
  stock: number;
  weightQuantity?: string;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  isFeatured: boolean;
  specifications?: Record<string, string>;
  variants?: {
    id: string;
    nameAr: string;
    nameEn: string;
    price: number;
    salePrice?: number;
    stock: number;
    sku: string;
    attributes: Record<string, string>;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const MOCK_BRANDS = [
  {
    id: 'brand-1',
    nameAr: 'مزارع الجبال الفاخرة',
    nameEn: 'Mountain Highlands Farms',
    slug: 'mountain-highlands',
    logoUrl:
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=150',
    descriptionAr: 'من أعالي قمم جبال جازان، نأتيك بأجود أنواع البن الخولاني البري الأصيل.',
    descriptionEn:
      'From the highest peaks of Jazan mountains, we bring you the finest authentic Khawlani coffee beans.',
  },
  {
    id: 'brand-2',
    nameAr: 'نخبة تمور القصيم والمدينة',
    nameEn: 'Premium Qassim & Madinah Dates',
    slug: 'premium-dates-co',
    logoUrl:
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=150',
    descriptionAr: 'تمور ملكية فاخرة ننتقيها حبة حبة من أعرق مزارع النخيل بالمملكة.',
    descriptionEn:
      'Premium royal dates selected piece by piece from the most ancient palm farms in the Kingdom.',
  },
  {
    id: 'brand-3',
    nameAr: 'حلويات القصر العتيق',
    nameEn: 'Antique Palace Sweets',
    slug: 'antique-palace-sweets',
    logoUrl:
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=150',
    descriptionAr: 'نجمع بين الشوكولاتة البلجيكية الغنية والنكهات الشرقية من هيل وزعفران.',
    descriptionEn:
      'Combining rich Belgian chocolate with warm Oriental flavours of saffron and cardamom.',
  },
  {
    id: 'brand-4',
    nameAr: 'نحاسيات وبيت الضيافة',
    nameEn: 'Guesthouse Brass & Copperwares',
    slug: 'guesthouse-copper',
    logoUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=150',
    descriptionAr: 'دلال وأطقم تقديم منقوشة يدوياً لتمثيل عراقة كرم الضيافة السعودية.',
    descriptionEn:
      'Hand-engraved coffee pots and serving items representing the roots of Saudi hospitality.',
  },
];

export const MOCK_CATEGORIES = [
  {
    id: 'saudi-coffee',
    nameAr: 'القهوة السعودية الفاخرة',
    nameEn: 'Premium Saudi Coffee',
    slug: 'saudi-coffee',
    imageUrl:
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    id: 'specialty-coffee',
    nameAr: 'القهوة المختصة',
    nameEn: 'Specialty Coffee',
    slug: 'specialty-coffee',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    id: 'dates',
    nameAr: 'التمور الفاخرة',
    nameEn: 'Premium Dates',
    slug: 'dates',
    imageUrl:
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    id: 'nuts',
    nameAr: 'المكسرات الطازجة',
    nameEn: 'Fresh Nuts',
    slug: 'nuts',
    imageUrl:
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    id: 'sweets',
    nameAr: 'الحلويات والشوكولاتة',
    nameEn: 'Sweets & Chocolates',
    slug: 'sweets',
    imageUrl:
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
  {
    id: 'accessories',
    nameAr: 'أدوات القهوة والتقديم',
    nameEn: 'Coffee Accessories',
    slug: 'accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    isActive: true,
  },
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-1',
    userName: 'عبدالله محمد',
    rating: 5,
    comment:
      'قهوة ممتازة جداً ونكهة الهيل والزعفران واضحة ومتناسقة، التغليف فاخر ويواجه لتقديمه كهدية.',
    isApproved: true,
    createdAt: '2026-06-15T12:00:00Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'user-2',
    userName: 'سارة العتيبي',
    rating: 4,
    comment: 'رائعة جداً وتذكرك بالقهوة السعودية الأصيلة على أصولها. توصيل سريع ومميز.',
    isApproved: true,
    createdAt: '2026-06-20T14:30:00Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userId: 'user-3',
    userName: 'خالد الدوسري',
    rating: 5,
    comment: 'البن طازج ومحمص بطريقة احترافية، الإيحاءات الحمضية خفيفة ولطيفة مع الاسبريسو.',
    isApproved: true,
    createdAt: '2026-06-18T09:15:00Z',
  },
  {
    id: 'rev-4',
    productId: 'prod-3',
    userId: 'user-4',
    userName: 'نوف القحطاني',
    rating: 5,
    comment: 'حبات التمر حجمها كبير واللوز محمص ومقرمش، التقديم يبيض الوجه للضيوف بالتأكيد.',
    isApproved: true,
    createdAt: '2026-06-25T17:45:00Z',
  },
  {
    id: 'rev-5',
    productId: 'prod-4',
    userId: 'user-5',
    userName: 'فهد الشمري',
    rating: 4,
    comment: 'المكسرات طازجة ومقرمشة ومحمصة بدون زيوت وهي ميزة ممتازة جداً وصحية.',
    isApproved: true,
    createdAt: '2026-06-22T11:00:00Z',
  },
];

export const MOCK_PRODUCTS: RawProduct[] = [
  {
    id: 'prod-1',
    nameAr: 'القهوة السعودية الفاخرة - الخلطة الذهبية',
    nameEn: 'Premium Saudi Coffee - Golden Blend',
    slug: 'premium-saudi-coffee-golden-blend',
    descriptionAr:
      'خلطة كلاسيكية محبوكة بالهيل والزعفران الفاخر من أجود حبوب البن الهرري شقراء التحميص، أعدت خصيصاً لتناسب مجالس الضيافة الكريمة.',
    descriptionEn:
      'A classic blend prepared with cardamoms and premium saffron from the finest light-roasted Harari coffee beans, custom crafted for traditional hospitality.',
    price: 85,
    salePrice: 75,
    imageUrls: [
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'saudi-coffee',
    brandId: 'brand-1',
    sku: 'JNAN-COF-01',
    stock: 45,
    weightQuantity: '500g',
    rating: 4.9,
    reviewsCount: 120,
    isActive: true,
    isFeatured: true,
    specifications: {
      'النوع / Type': 'هرري شقراء / Blonde Harari',
      'المنشأ / Origin': 'اليمن / Yemen',
      'الإضافات / Ingredients': 'هيل وزعفران وهيل نيجيري / Cardamom & Saffron',
      'التغليف / Packaging': 'كيس ألومنيوم محكم الإغلاق / Resealable foil pouch',
    },
    variants: [
      {
        id: 'var-1-1',
        nameAr: 'كيس 250 غرام',
        nameEn: '250g Pouch',
        price: 45,
        stock: 20,
        sku: 'JNAN-COF-01-250',
        attributes: { weight: '250g' },
      },
      {
        id: 'var-1-2',
        nameAr: 'كيس 500 غرام',
        nameEn: '500g Pouch',
        price: 85,
        salePrice: 75,
        stock: 45,
        sku: 'JNAN-COF-01-500',
        attributes: { weight: '500g' },
      },
      {
        id: 'var-1-3',
        nameAr: 'كيس 1 كيلو',
        nameEn: '1kg Pouch',
        price: 160,
        salePrice: 140,
        stock: 15,
        sku: 'JNAN-COF-01-1000',
        attributes: { weight: '1kg' },
      },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    nameAr: 'بن إثيوبي ييرغاشيفي مختص',
    nameEn: 'Ethiopian Yirgacheffe Specialty Coffee',
    slug: 'ethiopian-yirgacheffe-specialty',
    descriptionAr:
      'حبوب بن مجففة ذات إيحاءات زهرية وحمضية لطيفة وسلسة تناسب التقطير V60 والاسبريسو البارد.',
    descriptionEn:
      'Sun-dried coffee beans with floral notes and pleasant acidity, perfect for filter V60 and cold espresso drinks.',
    price: 65,
    imageUrls: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'specialty-coffee',
    brandId: 'brand-1',
    sku: 'JNAN-SPC-02',
    stock: 20,
    weightQuantity: '250g',
    rating: 4.8,
    reviewsCount: 88,
    isActive: true,
    isFeatured: true,
    specifications: {
      'المنطقة / Region': 'ييرغاشيفي كوشيري / Yirgacheffe Kochere',
      'السلالة / Variety': 'هيرلوم إرث / Heirloom',
      'المعالجة / Process': 'مجففة / Natural',
      'الإيحاءات / Notes': 'ياسمين، فواكه استوائية، ليمون / Jasmine, Tropical Fruits, Citrus',
      'التحميص / Roast': 'متوسط خفيف / Medium-Light',
    },
    variants: [
      {
        id: 'var-2-1',
        nameAr: 'حبوب كاملة 250غ',
        nameEn: 'Whole Beans 250g',
        price: 65,
        stock: 15,
        sku: 'JNAN-SPC-02-WB',
        attributes: { weight: '250g', grind: 'Whole' },
      },
      {
        id: 'var-2-2',
        nameAr: 'طحنة فلتر 250غ',
        nameEn: 'Filter Grind 250g',
        price: 65,
        stock: 5,
        sku: 'JNAN-SPC-02-FL',
        attributes: { weight: '250g', grind: 'Filter' },
      },
    ],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'prod-3',
    nameAr: 'تمر سكري فاخر محشي باللوز والهيل',
    nameEn: 'Luxury Stuffed Sukkari Dates',
    slug: 'luxury-stuffed-sukkari-dates',
    descriptionAr:
      'تمور سكري منتقاة حبة حبة، محشية باللوز الأمريكي المحمص المقرمش ومطيبة بنكهة الهيل الطبيعية في تغليف فاخر.',
    descriptionEn:
      'Selected Sukkari dates, stuffed with crunchy roasted American almonds and seasoned with natural cardamom flavor in premium gift wrapping.',
    price: 120,
    salePrice: 95,
    imageUrls: [
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'dates',
    brandId: 'brand-2',
    sku: 'JNAN-DAT-03',
    stock: 15,
    weightQuantity: '1kg',
    rating: 4.9,
    reviewsCount: 95,
    isActive: true,
    isFeatured: true,
    specifications: {
      'النوع / Type': 'سكري رطب ملكي / Royal Sukkari',
      'الحشو / Stuffing': 'لوز مقشر محمص / Roasted peeled almonds',
      'الوزن الصافي / Net Weight': '١ كيلو غرام / 1 kg',
      'الحفظ / Storage': 'يحفظ في مكان بارد وجاف / Keep in cool dry place',
    },
    variants: [
      {
        id: 'var-3-1',
        nameAr: 'علبة 500 غرام',
        nameEn: '500g Box',
        price: 65,
        salePrice: 55,
        stock: 10,
        sku: 'JNAN-DAT-03-500',
        attributes: { weight: '500g' },
      },
      {
        id: 'var-3-2',
        nameAr: 'علبة 1 كيلو غرام',
        nameEn: '1kg Box',
        price: 120,
        salePrice: 95,
        stock: 15,
        sku: 'JNAN-DAT-03-1000',
        attributes: { weight: '1kg' },
      },
    ],
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'prod-4',
    nameAr: 'مكسرات مشكلة فاخرة محمصة',
    nameEn: 'Roasted Premium Mixed Nuts',
    slug: 'roasted-premium-mixed-nuts',
    descriptionAr:
      'مزيج فاخر من اللوز البلدي، الكاجو، الكستناء، والفستق المحمص بدون إضافة أي زيوت وبقوام طازج مالح.',
    descriptionEn:
      'Luxury blend of roasted almonds, cashews, chestnuts, and pistachios, prepared oil-free with rich savory textures.',
    price: 50,
    imageUrls: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'nuts',
    sku: 'JNAN-NUT-04',
    stock: 8,
    weightQuantity: '250g',
    rating: 4.7,
    reviewsCount: 64,
    isActive: true,
    isFeatured: true,
    specifications: {
      'المكونات / Mix': 'كاجو، فستق، لوز، بندق / Cashew, Pistachio, Almond, Hazelnut',
      'طريقة التحميص / Roast': 'تحميص هوائي بدون زيت / Air roasted oil-free',
      'النكهة / Flavour': 'مملح خفيف / Lightly Salted',
    },
    variants: [
      {
        id: 'var-4-1',
        nameAr: 'كيس 250 غرام',
        nameEn: '250g Bag',
        price: 50,
        stock: 8,
        sku: 'JNAN-NUT-04-250',
        attributes: { weight: '250g' },
      },
      {
        id: 'var-4-2',
        nameAr: 'كيس 500 غرام',
        nameEn: '500g Bag',
        price: 95,
        stock: 12,
        sku: 'JNAN-NUT-04-500',
        attributes: { weight: '500g' },
      },
    ],
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-01-03T00:00:00Z',
  },
  {
    id: 'prod-5',
    nameAr: 'القهوة السعودية بالهيل - خلطة الكلاسيك',
    nameEn: 'Cardamom Scented Saudi Coffee - Classic',
    slug: 'saudi-coffee-cardamom-classic',
    descriptionAr:
      'خلطة متوازنة غنية بنكهة الهيل الهندي الفاخر والزعفران، أعدت بوصفة أهل نجد التقليدية.',
    descriptionEn:
      'A balanced blend rich in premium Indian cardamom and saffron, prepared using Najd traditional recipe.',
    price: 75,
    imageUrls: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'saudi-coffee',
    brandId: 'brand-1',
    sku: 'JNAN-COF-05',
    stock: 30,
    weightQuantity: '500g',
    rating: 4.6,
    reviewsCount: 45,
    isActive: true,
    isFeatured: false,
    specifications: {
      'التحميص / Roast': 'شقراء نجدية متوسطة / Najd Blonde Medium',
      'المكونات / Mix': 'بن هرري، هيل، خلطة القصيم / Harari Coffee, Cardamom, Qassim Spices',
      'الوزن / Weight': '٥٠٠ غرام / 500g',
    },
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'prod-6',
    nameAr: 'بن كولومبي سوبريمو مختص',
    nameEn: 'Colombian Supremo Specialty Coffee',
    slug: 'colombian-supremo-specialty',
    descriptionAr:
      'بن كولومبي مختص من مرتفعات الأنديز بإيحاءات الكراميل والشوكولاتة وقوام ممتلئ متزن غني.',
    descriptionEn:
      'Specialty Colombian coffee from the Andes range with caramel and chocolate notes and a rich, balanced full body.',
    price: 55,
    salePrice: 45,
    imageUrls: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'specialty-coffee',
    brandId: 'brand-1',
    sku: 'JNAN-SPC-06',
    stock: 50,
    weightQuantity: '250g',
    rating: 4.7,
    reviewsCount: 70,
    isActive: true,
    isFeatured: false,
    specifications: {
      'المنشأ / Origin': 'كولومبيا سوبريمو / Colombia Supremo',
      'الإيحاءات / Notes': 'كراميل، فواكه حمراء، كاكاو / Caramel, Red Fruits, Cocoa',
      'المعالجة / Process': 'مغسولة / Washed',
      'الارتفاع / Altitude': '١٨٠٠م / 1800m',
    },
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'prod-7',
    nameAr: 'تمر عجوة المدينة المنورة فاخر',
    nameEn: 'Ajwa Al-Madinah Premium Dates',
    slug: 'ajwa-madinah-premium-dates',
    descriptionAr:
      'تمر العجوة المبارك من مزارع العالية بالمدينة المنورة، حبات سوداء ناعمة غنية بالألياف والمعادن المفيدة.',
    descriptionEn:
      'Blessed Ajwa dates from Al-Aliya farms in Madinah, smooth dark fruits rich in natural fibers and minerals.',
    price: 150,
    imageUrls: [
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'dates',
    brandId: 'brand-2',
    sku: 'JNAN-DAT-07',
    stock: 25,
    weightQuantity: '1kg',
    rating: 5.0,
    reviewsCount: 110,
    isActive: true,
    isFeatured: true,
    specifications: {
      'المنشأ / Origin': 'المدينة المنورة - العالية / Madinah Al-Aliya',
      'الدرجة / Grade': 'نخب أول / First Class',
      'الوزن / Weight': '١ كيلو / 1 kg',
    },
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'prod-8',
    nameAr: 'تمر خلاص الأحساء بخلطة العسل',
    nameEn: 'Al-Ahsa Khalas Dates with Honey',
    slug: 'al-ahsa-khalas-honey-dates',
    descriptionAr:
      'تمور خلاص الأحساء الذهبية الفاخرة مغمورة بقطرات العسل الجبلي الطبيعي ورشة من السمسم والزعتر البري.',
    descriptionEn:
      'Premium golden Al-Ahsa Khalas dates dipped in natural mountain honey and dusted with sesame and thyme.',
    price: 90,
    imageUrls: [
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'dates',
    brandId: 'brand-2',
    sku: 'JNAN-DAT-08',
    stock: 0,
    weightQuantity: '500g',
    rating: 4.5,
    reviewsCount: 32,
    isActive: true,
    isFeatured: false,
    specifications: {
      'نوع التمر / Date Type': 'خلاص الأحساء / Al-Ahsa Khalas',
      'الإضافات / Additives': 'عسل نحل طبيعي، سمسم / Natural Honey, Sesame',
      'الوزن / Weight': '٥٠٠ غرام / 500g',
    },
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'prod-9',
    nameAr: 'فستق حلبي مدخن بحري وملح',
    nameEn: 'Smoked Pistachios with Sea Salt',
    slug: 'smoked-pistachios-sea-salt',
    descriptionAr: 'فستق حلبي فاخر مدخن ببطء بأخشاب البلوط ومحمص مع ذرات الملح البحري الغني.',
    descriptionEn:
      'Premium Syrian pistachios slowly oak-smoked and roasted with mineral-rich sea salt.',
    price: 60,
    imageUrls: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'nuts',
    sku: 'JNAN-NUT-09',
    stock: 12,
    weightQuantity: '200g',
    rating: 4.8,
    reviewsCount: 55,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'prod-10',
    nameAr: 'لوز مقرمش محمص بالكراميل والعسل',
    nameEn: 'Crunchy Honey Caramel Glazed Almonds',
    slug: 'honey-caramel-glazed-almonds',
    descriptionAr:
      'حبات اللوز الأمريكي الكبير المنتقاة بعناية والمغطاة بطبقة مقرمشة وحلوة من عسل السدر الطبيعي والكراميل الذائب.',
    descriptionEn:
      'Carefully chosen large American almonds coated with a sweet, crunchy layer of Sidr honey and melted caramel.',
    price: 45,
    imageUrls: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'nuts',
    sku: 'JNAN-NUT-10',
    stock: 18,
    weightQuantity: '250g',
    rating: 4.4,
    reviewsCount: 28,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-02-20T00:00:00Z',
    updatedAt: '2026-02-20T00:00:00Z',
  },
  {
    id: 'prod-11',
    nameAr: 'صندوق شوكولاتة جنان الفاخرة',
    nameEn: 'Jnan Luxury Chocolate Assortment Box',
    slug: 'jnan-luxury-chocolate-box',
    descriptionAr:
      'تشكيلة فاخرة من الترافل والشوكولاتة البلجيكية الغنية بنكهات شرقية مميزة مثل الورد والهيل والزعفران للضيافة الراقية.',
    descriptionEn:
      'A luxury selection of Belgian truffles and rich chocolates infused with unique Oriental flavours like rose, cardamom and saffron.',
    price: 110,
    salePrice: 90,
    imageUrls: [
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'sweets',
    brandId: 'brand-3',
    sku: 'JNAN-SWE-11',
    stock: 14,
    weightQuantity: '400g',
    rating: 4.9,
    reviewsCount: 82,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-01-25T00:00:00Z',
  },
  {
    id: 'prod-12',
    nameAr: 'معمول التمر التقليدي بالهيل والبر',
    nameEn: 'Traditional Wholewheat Date Maamoul',
    slug: 'traditional-date-maamoul',
    descriptionAr:
      'معمول محشو بأجود أنواع تمور الخلاص ومعد بالطحين البر الفاخر والسمن البري على طريقة الجدات.',
    descriptionEn:
      'Traditional maamoul cookies stuffed with premium Khalas dates, wholewheat flour and pure ghee in traditional style.',
    price: 40,
    imageUrls: [
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'sweets',
    brandId: 'brand-3',
    sku: 'JNAN-SWE-12',
    stock: 40,
    weightQuantity: '500g',
    rating: 4.7,
    reviewsCount: 63,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'prod-13',
    nameAr: 'شوكولاتة الحليب بالزعفران والهيل',
    nameEn: 'Saffron & Cardamom Milk Chocolates',
    slug: 'saffron-cardamom-milk-chocolate',
    descriptionAr:
      'ألواح شوكولاتة الحليب السويسرية الفاخرة المعززة بخيوط الزعفران الأصيل ونكهة الهيل الدافئة المطحونة.',
    descriptionEn:
      'Premium Swiss milk chocolate bars enhanced with genuine saffron threads and warm ground cardamom hints.',
    price: 70,
    imageUrls: [
      'https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'sweets',
    brandId: 'brand-3',
    sku: 'JNAN-SWE-13',
    stock: 3,
    weightQuantity: '300g',
    rating: 4.5,
    reviewsCount: 18,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'prod-14',
    nameAr: 'دلة القهوة النحاسية التقليدية النقش',
    nameEn: 'Traditional Hand-Engraved Copper Dallah',
    slug: 'traditional-copper-dallah',
    descriptionAr:
      'دلة عربية كلاسيكية مصنوعة يدوياً من النحاس السوري الأحمر النقي المطلي بنقوش تراثية ساحرة مقاومة للحرارة.',
    descriptionEn:
      'Handcrafted classic Arabic Dallah made of pure red Syrian brass, finished with heat-resistant traditional engraved details.',
    price: 280,
    salePrice: 250,
    imageUrls: [
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'accessories',
    brandId: 'brand-4',
    sku: 'JNAN-ACC-14',
    stock: 5,
    weightQuantity: '1 Unit',
    rating: 4.9,
    reviewsCount: 50,
    isActive: true,
    isFeatured: true,
    createdAt: '2026-01-08T00:00:00Z',
    updatedAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 'prod-15',
    nameAr: 'طقم تقطير القهوة السيراميك الفاخر',
    nameEn: 'Ceramic Specialty Coffee Dripper Set',
    slug: 'ceramic-coffee-dripper-set',
    descriptionAr:
      'طقم متكامل للتقطير يحتوي على قمع سيراميك V60، سيرفر زجاجي وحامل خشبي أنيق مع ميزان رقمي مدمج.',
    descriptionEn:
      'A complete specialty drip set including V60 ceramic dripper, glass server, and elegant wooden stand with built-in scale.',
    price: 120,
    imageUrls: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'accessories',
    brandId: 'brand-4',
    sku: 'JNAN-ACC-15',
    stock: 15,
    weightQuantity: '1 Set',
    rating: 4.8,
    reviewsCount: 42,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-02-28T00:00:00Z',
    updatedAt: '2026-02-28T00:00:00Z',
  },
  {
    id: 'prod-16',
    nameAr: 'طقم فناجين قهوة عربية رخامي (٦ قطع)',
    nameEn: 'Marble Arabic Coffee Cups Set (6 pcs)',
    slug: 'marble-arabic-cups-set',
    descriptionAr:
      'فناجين قهوة عربية بورسلان بتصميم رخامي راقٍ مع حواف مطلية بماء الذهب الفاخر عيار ٢٤ قيراط.',
    descriptionEn:
      'Arabic coffee cups crafted from fine porcelain, featuring premium marble designs and elegant 24k gold-plated rims.',
    price: 95,
    imageUrls: [
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'accessories',
    brandId: 'brand-4',
    sku: 'JNAN-ACC-16',
    stock: 22,
    weightQuantity: '6 Pcs',
    rating: 4.7,
    reviewsCount: 37,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-03-05T00:00:00Z',
    updatedAt: '2026-03-05T00:00:00Z',
  },
  {
    id: 'prod-17',
    nameAr: 'بن إثيوبي هرري مختص محمص للقهوة العربية',
    nameEn: 'Ethiopian Harar Roasted Coffee for Arabic Brew',
    slug: 'ethiopian-harar-roasted-arabic-coffee',
    descriptionAr:
      'حبوب بن هرري منتقاة ومحمصة تحميصاً شقراً خفيفاً خصيصاً لتحضير القهوة السعودية والخليجية الكلاسيكية.',
    descriptionEn:
      'Selected Harar coffee beans, lightly roasted (blonde roast) tailored for traditional Saudi coffee preparation.',
    price: 70,
    imageUrls: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'saudi-coffee',
    brandId: 'brand-1',
    sku: 'JNAN-COF-17',
    stock: 10,
    weightQuantity: '250g',
    rating: 4.6,
    reviewsCount: 29,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-03-10T00:00:00Z',
    updatedAt: '2026-03-10T00:00:00Z',
  },
  {
    id: 'prod-18',
    nameAr: 'تمر خلاص القصيم الملكي الكرتون المميز',
    nameEn: 'Royal Khalas Al-Qassim Dates - Premium Pack',
    slug: 'royal-khalas-qassim-dates',
    descriptionAr:
      'أفخر تمور خلاص القصيم الذهبية المنتقاة بعناية لتقدم كهدية أو ضيافة كلاسيكية في المجالس الفاخرة.',
    descriptionEn:
      'The finest golden Khalas Al-Qassim dates, carefully vacuum-packed for premium gifting or hospitality.',
    price: 80,
    salePrice: 65,
    imageUrls: [
      'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'dates',
    brandId: 'brand-2',
    sku: 'JNAN-DAT-18',
    stock: 35,
    weightQuantity: '1kg',
    rating: 4.8,
    reviewsCount: 73,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-03-12T00:00:00Z',
    updatedAt: '2026-03-12T00:00:00Z',
  },
  {
    id: 'prod-19',
    nameAr: 'كاجو محمص متبل بالليمون والفلفل',
    nameEn: 'Roasted Chili & Lemon Seasoned Cashews',
    slug: 'chili-lemon-roasted-cashews',
    descriptionAr:
      'حبات الكاجو الكبيرة الطازجة المحمصة بحرفية والمغلفة بنكهة الليمون الحمضية والفلفل الحار الطبيعي.',
    descriptionEn:
      'Fresh whole large cashews, expertly roasted and flavored with citrusy lemon and a dash of hot chili.',
    price: 48,
    imageUrls: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'nuts',
    sku: 'JNAN-NUT-19',
    stock: 15,
    weightQuantity: '250g',
    rating: 4.5,
    reviewsCount: 24,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-03-15T00:00:00Z',
  },
  {
    id: 'prod-20',
    nameAr: 'القهوة السعودية بخلطة حائل الفاخرة',
    nameEn: 'Premium Saudi Coffee - Hail Traditional Blend',
    slug: 'saudi-coffee-hail-traditional',
    descriptionAr:
      'خلطة أهل حائل المشهورة بالهيل المرتفع والنخوة والزعفران الأصلي الكاشف، تعطيك لوناً ومذاقاً مميزاً.',
    descriptionEn:
      'The traditional Hail region blend, famous for its higher cardamom punch, spices, and premium saffron.',
    price: 80,
    imageUrls: [
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600',
    ],
    categoryId: 'saudi-coffee',
    brandId: 'brand-1',
    sku: 'JNAN-COF-20',
    stock: 12,
    weightQuantity: '500g',
    rating: 4.8,
    reviewsCount: 51,
    isActive: true,
    isFeatured: false,
    createdAt: '2026-03-18T00:00:00Z',
    updatedAt: '2026-03-18T00:00:00Z',
  },
];
