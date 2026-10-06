const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- شروع بذر اولیه داده‌های پلتفرم آبشن خودرو ---');

  // 1. پاکسازی داده‌های قبلی برای سید تمیز
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.messageAttachment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.orderRequest.deleteMany();
  await prisma.packageProduct.deleteMany();
  await prisma.package.deleteMany();
  await prisma.productVehicleCompatibility.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userVehicle.deleteMany();
  await prisma.vehicleYear.deleteMany();
  await prisma.vehicleTrim.deleteMany();
  await prisma.vehicleModel.deleteMany();
  await prisma.vehicleBrand.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.project.deleteMany();
  await prisma.story.deleteMany();
  await prisma.chatbotFAQ.deleteMany();

  // 2. تنظیمات پایه سایت
  await prisma.siteSetting.create({
    data: {
      id: 'singleton',
      siteName: 'پلتفرم تخصصی مهندسی و تجهیز آبشن خودرو',
      siteTagline: 'مرکز تخصصی مشاوره، انتخاب و درخواست آبشن‌های فابریک و پیشرفته خودرو',
      logo: '/images/logo-caroption.png',
      phone: '021-88992211',
      email: 'contact@caroption.ir',
      address: 'تهران، خیابان شریعتی، نرسیده به پل سیدخندان، مجتمع تخصصی خودرو طبقه ۱',
      mapLat: 35.7412,
      mapLng: 51.4289,
      heroTitle: 'ارتقای مهندسی و تجهیز هوشمند آبشن‌های خودرو',
      heroSubtitle: 'بررسی تخصصی سازگاری با مدل و سال خودرو، حفظ سیم‌کشی و گارانتی فابریک، بدون پرداخت مستقیم با مشاوره فنی اختصاصی',
      defaultTheme: 'hybrid',
    },
  });

  // 3. نقش‌ها و ادمین اصلی
  const superAdminRole = await prisma.role.create({
    data: {
      name: 'Super Admin',
      description: 'دسترسی کامل به تمامی بخش‌های مدیریتی و تنظیمات سیستم',
      permissions: JSON.stringify(['ALL']),
    },
  });

  await prisma.role.create({
    data: {
      name: 'Product Admin',
      description: 'مدیریت محصولات، خودروها، دسته‌ها و پکیج‌ها',
      permissions: JSON.stringify(['PRODUCTS', 'VEHICLES', 'CATEGORIES', 'PACKAGES']),
    },
  });

  await prisma.role.create({
    data: {
      name: 'Support & Orders Admin',
      description: 'مدیریت درخواست‌های سفارش، چت داخلی و پشتیبانی کاربران',
      permissions: JSON.stringify(['ORDERS', 'CHATS', 'USERS', 'REVIEWS']),
    },
  });

  const passwordHash = await bcrypt.hash('Admin@123456', 10);
  const superAdmin = await prisma.user.create({
    data: {
      fullName: 'مدیریت ارشد سیستم',
      email: 'admin@caroption.ir',
      phone: '09121111111',
      passwordHash: passwordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  await prisma.adminUser.create({
    data: {
      name: 'مدیر کل مجموعه',
      email: 'admin@caroption.ir',
      password: passwordHash,
      roleId: superAdminRole.id,
    },
  });

  // 4. برندها و مدل‌های خودرو (سلسله‌مراتب واقعی)
  const ikco = await prisma.vehicleBrand.create({
    data: {
      nameFa: 'ایران خودرو',
      nameEn: 'Iran Khodro',
      slug: 'ikco',
      logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80',
    },
  });

  const saipa = await prisma.vehicleBrand.create({
    data: {
      nameFa: 'سایپا',
      nameEn: 'Saipa',
      slug: 'saipa',
      logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=200&q=80',
    },
  });

  const hyundai = await prisma.vehicleBrand.create({
    data: {
      nameFa: 'هیوندای',
      nameEn: 'Hyundai',
      slug: 'hyundai',
      logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80',
    },
  });

  // مدل‌ها و تیپ‌های دنا پلاس
  const dena = await prisma.vehicleModel.create({
    data: {
      brandId: ikco.id,
      nameFa: 'دنا پلاس',
      nameEn: 'Dena Plus',
      slug: 'dena-plus',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    },
  });

  const denaTurboTrim = await prisma.vehicleTrim.create({
    data: {
      modelId: dena.id,
      nameFa: 'توربو اتوماتیک آپشنال',
      nameEn: 'Turbo AT Optional',
    },
  });

  const denaYear1402 = await prisma.vehicleYear.create({
    data: { trimId: denaTurboTrim.id, year: '1402' },
  });
  const denaYear1403 = await prisma.vehicleYear.create({
    data: { trimId: denaTurboTrim.id, year: '1403' },
  });
  const denaYear1404 = await prisma.vehicleYear.create({
    data: { trimId: denaTurboTrim.id, year: '1404' },
  });

  // مدل تارا
  const tara = await prisma.vehicleModel.create({
    data: {
      brandId: ikco.id,
      nameFa: 'تارا',
      nameEn: 'Tara',
      slug: 'tara',
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
    },
  });

  const taraV4Trim = await prisma.vehicleTrim.create({
    data: {
      modelId: tara.id,
      nameFa: 'اتوماتیک V4 LX',
      nameEn: 'AT V4 LX',
    },
  });
  const taraYear1403 = await prisma.vehicleYear.create({
    data: { trimId: taraV4Trim.id, year: '1403' },
  });

  // شاهین سایپا
  const shahin = await prisma.vehicleModel.create({
    data: {
      brandId: saipa.id,
      nameFa: 'شاهین',
      nameEn: 'Shahin',
      slug: 'shahin',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    },
  });
  const shahinGTrim = await prisma.vehicleTrim.create({
    data: {
      modelId: shahin.id,
      nameFa: 'G دنده‌ای و اتوماتیک',
      nameEn: 'G Series',
    },
  });
  await prisma.vehicleYear.create({
    data: { trimId: shahinGTrim.id, year: '1402' },
  });
  await prisma.vehicleYear.create({
    data: { trimId: shahinGTrim.id, year: '1403' },
  });

  // 5. دسته‌بندی‌های چندسطحی (Mega Menu Structure)
  const catVisual = await prisma.category.create({
    data: {
      nameFa: 'سیستم‌های تصویری و چندرسانه‌ای',
      nameEn: 'Multimedia & Display',
      slug: 'multimedia',
      icon: 'Tv',
      orderIndex: 1,
      description: 'مانیتورهای فابریک اندروید، دوربین‌های ۳۶۰ درجه و نمایشگرهای پشت‌سری',
    },
  });

  const catMonitor = await prisma.category.create({
    data: {
      parentId: catVisual.id,
      nameFa: 'مانیتور اندروید فابریک',
      nameEn: 'Android Headunit',
      slug: 'android-headunit',
      icon: 'Monitor',
      orderIndex: 1,
    },
  });

  const catCamera360 = await prisma.category.create({
    data: {
      parentId: catVisual.id,
      nameFa: 'دوربین ۳۶۰ درجه ۳D',
      nameEn: '360 Birdview Camera',
      slug: '360-camera',
      icon: 'Camera',
      orderIndex: 2,
    },
  });

  const catAssistance = await prisma.category.create({
    data: {
      nameFa: 'تجهیزات ایمنی و کمک راننده',
      nameEn: 'Safety & Driving Assist',
      slug: 'safety-assist',
      icon: 'ShieldCheck',
      orderIndex: 2,
      description: 'کروز کنترل تطبیقی، سنسورهای رادار، ردیاب ماهواره‌ای و پایش باد لاستیک',
    },
  });

  const catCruise = await prisma.category.create({
    data: {
      parentId: catAssistance.id,
      nameFa: 'کروز کنترل هوشمند و لیمیتر',
      nameEn: 'Adaptive Cruise Control',
      slug: 'cruise-control',
      icon: 'Gauge',
      orderIndex: 1,
    },
  });

  const catComfort = await prisma.category.create({
    data: {
      nameFa: 'تجهیزات رفاهی و آسایش',
      nameEn: 'Comfort & Convenience',
      slug: 'comfort-convenience',
      icon: 'Sparkles',
      orderIndex: 3,
      description: 'کلاچ اتوماتیک هوشمند، آینه‌های تاشو برقی، کی‌لس استارت و گرم‌کن صندلی',
    },
  });

  const catAutoClutch = await prisma.category.create({
    data: {
      parentId: catComfort.id,
      nameFa: 'کلاچ اتوماتیک هوشمند (برقی)',
      nameEn: 'Smart Auto Clutch',
      slug: 'smart-auto-clutch',
      icon: 'Cpu',
      orderIndex: 1,
    },
  });

  // 6. برندهای آبشن
  const brandPioneer = await prisma.brand.create({
    data: {
      nameFa: 'پایونیر',
      nameEn: 'Pioneer',
      slug: 'pioneer',
      description: 'پیشرو در سیستم‌های صوتی و تصویری خودرو',
    },
  });

  const brandViper = await prisma.brand.create({
    data: {
      nameFa: 'وایپرو مهندسی',
      nameEn: 'Vipro Engineering',
      slug: 'vipro',
      description: 'تولیدکننده تخصصی سیستم‌های کنترل کروز و کلاچ اتوماتیک فابریک',
    },
  });

  // 7. محصولات تخصصی همراه با مشخصات و سازگاری کامل
  const prod1 = await prisma.product.create({
    data: {
      sku: 'OPT-CRU-DENA01',
      titleFa: 'کروز کنترل فابریک دنا پلاس با لیمیتر سرعت و کلیدهای فابریک غربیلک',
      titleEn: 'OEM Cruise Control & Speed Limiter for Dena Plus',
      slug: 'dena-plus-oem-cruise-control',
      shortDesc: 'سیستم کروز کنترل کاملاً فابریک، بدون دستکاری در دسته سیم خودرو با اتصال به شبکه CAN و نمایشگر آمپر',
      fullDesc: 'این سیستم مستقیماً به ECU بوش و غربیلک فرمان دنا پلاس متصل شده و امکان تثبیت دقیق سرعت و تنظیم لیمیتر را فراهم می‌سازد. به همراه چراغ پشت آمپر فعال و قطع هوشمند با پدال‌های ترمز و کلاچ.',
      brandId: brandViper.id,
      stockStatus: 'AVAILABLE',
      priceStatus: 'INQUIRY', // استعلام قیمت مهندسی
      warranty: '۲۴ ماه گارانتی تعویض کتبی و ۵ سال خدمات پشتیبانی',
      installation: 'نصب سوکت به سوکت در ۱ ساعت بدون ابطال گارانتی خودرو',
      specs: JSON.stringify({
        'پروتکل ارتباطی': 'شبکه استاندارد CAN Bus خودرویی',
        'قابلیت‌ها': 'تثبیت سرعت، لیمیتر ماکزیمم، شیفت سرعت با گام ۱km/h',
        'امنیت': 'قطع آنی با سنسور دوگانه ترمز و کلاچ',
        'تداخل سیم‌کشی': 'صفر - کاملاً سوکت فابریک',
      }),
      features: JSON.stringify([
        'بدون تغییر در سیم‌کشی فابریک خودرو',
        'سازگار با سیستم ترمز ضد قفل ABS/ESC',
        'حفظ کامل گارانتی نمایندگی ایران‌خودرو',
        'کلیدهای فابریک منطبق با طراحی داخلی غربیلک',
      ]),
      isFeatured: true,
      rating: 4.9,
    },
  });

  await prisma.productCategory.create({
    data: { productId: prod1.id, categoryId: catCruise.id },
  });

  await prisma.productMedia.create({
    data: {
      productId: prod1.id,
      url: 'https://images.unsplash.com/photo-1541348263662-e0c82661210e?auto=format&fit=crop&w=1000&q=80',
      type: 'IMAGE',
      isPrimary: true,
      title: 'کلیدهای کروز کنترل فابریک غربیلک فرمان',
    },
  });

  // ثبت سازگاری با دنا پلاس
  await prisma.productVehicleCompatibility.create({
    data: {
      productId: prod1.id,
      trimId: denaTurboTrim.id,
      yearId: denaYear1403.id,
      status: 'FULL',
      notes: 'سازگاری ۱۰۰٪ با سوکت فابریک پشت سوئیچ و اتصال به کلاستر آمپر دیجیتال',
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      sku: 'OPT-MON-TARA11',
      titleFa: 'مانیتور اندروید ۱۲ اینچ فابریک تارا اتوماتیک با پردازنده ۸ هسته‌ای و رم ۸GB',
      titleEn: '12-inch Android Headunit for Tara AT (8-Core / 8GB RAM)',
      slug: 'tara-android-headunit-12inch',
      shortDesc: 'نمایشگر خازنی ضد تابش با وضوح 2K QLED، پشتیبانی از اپل کارپلی بیسیم و اندروید اتو و صدای DSP صوتی حرفه‌ای',
      fullDesc: 'مانیتور مهندسی‌شده مخصوص تارا همراه با قاب قالبی داشبورد بدون کوچکترین درز. مجهز به پردازنده فوق‌سریع UIS7862 و سیستم خنک‌کننده فن هوشمند برای کارکرد پایدار در فصول گرم.',
      brandId: brandPioneer.id,
      stockStatus: 'AVAILABLE',
      priceStatus: 'SHOW_PRICE',
      price: 18500000,
      warranty: '۱۸ ماه گارانتی طلایی شرکت با تعویض آنی قطعه',
      installation: 'تعویض مستقیم قاب فابریک و اتصال سوکت‌های برق و فرمان خودرو',
      specs: JSON.stringify({
        'پردازنده': 'Octa-Core Unisoc 2.0GHz 64bit',
        'حافظه رم و رام': '8GB RAM + 128GB Storage',
        'صفحه نمایش': 'QLED 2K Anti-Glare IPS 1280x720',
        'اتصالات': 'Apple CarPlay و Android Auto بی‌سیم، سیم‌کارت 4G LTE',
        'پردازش صدا': 'خروجی DSP ۳۲ باند اکولایزر مستقل',
      }),
      features: JSON.stringify([
        'پشتیبانی همزمان از کلیدهای کنترل روی فرمان',
        'سازگاری کامل با دوربین دنده عقب و سنسورهای فابریک خودرو',
        'امکان اجرای برنامه‌های مسیریاب نشان، بلد و ویز',
      ]),
      isFeatured: true,
      rating: 5.0,
    },
  });

  await prisma.productCategory.create({
    data: { productId: prod2.id, categoryId: catMonitor.id },
  });

  await prisma.productMedia.create({
    data: {
      productId: prod2.id,
      url: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&w=1000&q=80',
      type: 'IMAGE',
      isPrimary: true,
      title: 'نمای مانیتور نصب شده در داشبورد تارا',
    },
  });

  await prisma.productVehicleCompatibility.create({
    data: {
      productId: prod2.id,
      trimId: taraV4Trim.id,
      yearId: taraYear1403.id,
      status: 'FULL',
      notes: 'منطبق با کن‌باس سیستم برق اکوماکس و کنترل پشت فرمان',
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      sku: 'OPT-CAM-360U',
      titleFa: 'سیستم دوربین ۳۶۰ درجه پرنده‌ای (Birdview 3D) دید در شب استارلایت سونی',
      titleEn: 'Sony Starvis 3D 360-degree Panoramic Camera System',
      slug: 'sony-starvis-360-camera-system',
      shortDesc: 'سیستم ۴ دوربین واید ضدآب با پردازش تصویر سه‌بعدی real-time و سنسور ضبط وقایع ۲۴ ساعته در حالت پارک',
      fullDesc: 'چهار سنسور سونی استارلایت در جلو، عقب و زیر آینه‌های جانبی تعبیه شده و دیدی کامل از پرنده بدون هیچ نقطه کوری بر روی مانیتور ارائه می‌دهند. قابلیت خطوط دینامیک پارک هماهنگ با زاویه فرمان.',
      brandId: brandViper.id,
      stockStatus: 'AVAILABLE',
      priceStatus: 'CALL',
      warranty: '۲ سال ضمانت بی‌قیدوشرط لنز و بورد مرکزی',
      installation: 'کالیبراسیون تخصصی با شابلون‌های لیزری در استودیو نصب',
      specs: JSON.stringify({
        'سنسورهای تصویر': 'Sony IMX307 Night Vision Starlight F1.6',
        'رزولوشن خروجی': 'Full HD 1080P با زاویه دید ۲۱۰ درجه عریض',
        'استاندارد عایق': 'IP68 کاملاً ضد آب و گرد و غبار',
      }),
      features: JSON.stringify([
        'دید در شب فوق‌العاده شفاف حتی در تاریکی مطلق',
        'خطوط متحرک راهنمای پارک همگام با چرخش فرمان (PAS)',
        'سیستم جعبه سیاه و ضبط مداوم تصادفات روی فلش مموری',
      ]),
      isFeatured: true,
      isSpecialOffer: true,
      rating: 4.8,
    },
  });

  await prisma.productCategory.create({
    data: { productId: prod3.id, categoryId: catCamera360.id },
  });

  await prisma.productMedia.create({
    data: {
      productId: prod3.id,
      url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1000&q=80',
      type: 'IMAGE',
      isPrimary: true,
      title: 'دوربین‌های چهارگانه ۳۶۰ درجه و شبیه‌سازی ۳D',
    },
  });

  // 8. پکیج کامل آبشن (Package System)
  const pkgDena = await prisma.package.create({
    data: {
      titleFa: 'پکیج مهندسی ارتقای کامل ایمنی و آسایش دنا پلاس',
      titleEn: 'Dena Plus Master Upgrade Engineering Package',
      slug: 'dena-plus-master-package',
      description: 'تجمیع کروز کنترل فابریک، مانیتور ۱۲ اینچ اندروید و دوربین ۳۶۰ درجه به همراه نصب همزمان و تنظیمات تخصصی با تخفیف ویژه پکیج',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80',
      priceStatus: 'INQUIRY',
      isActive: true,
    },
  });

  await prisma.packageProduct.create({
    data: { packageId: pkgDena.id, productId: prod1.id, orderIndex: 1 },
  });
  await prisma.packageProduct.create({
    data: { packageId: pkgDena.id, productId: prod3.id, orderIndex: 2 },
  });

  // 9. پروژه‌های نصب‌شده و Before / After
  await prisma.project.create({
    data: {
      title: 'تجهیز کامل تارا اتوماتیک V4 به سیستم مانیتور لمسی و دوربین ۳۶۰ درجه سونی',
      slug: 'project-tara-v4-full-upgrade',
      vehicleName: 'تارا اتوماتیک مدل ۱۴۰۳',
      description: 'نصب بدون برش سیم‌کشی، کالیبراسیون دوربین ۳۶۰ با پارچه‌های شطرنجی لیزری و یکپارچه‌سازی با کلیدهای غربیلک فرمان.',
      coverImage: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1000&q=80',
      beforeImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
      afterImage: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&w=800&q=80',
      productsUsed: JSON.stringify(['مانیتور ۱۲ اینچ تارا', 'دوربین ۳۶۰ استارلایت']),
    },
  });

  // 10. سیستم Stories
  await prisma.story.create({
    data: {
      title: 'تست دوربین ۳۶۰ درجه در شب',
      mediaUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
      mediaType: 'IMAGE',
      linkUrl: `/products/${prod3.slug}`,
      orderIndex: 1,
    },
  });

  await prisma.story.create({
    data: {
      title: 'نصب کروز فابریک دنا پلاس ۱۴۰۳',
      mediaUrl: 'https://images.unsplash.com/photo-1541348263662-e0c82661210e?auto=format&fit=crop&w=600&q=80',
      mediaType: 'IMAGE',
      linkUrl: `/products/${prod1.slug}`,
      orderIndex: 2,
    },
  });

  // 11. شبکه‌های اجتماعی و پیام‌رسان‌ها (شامل ایتا، روبیکا، تلگرام، اینستاگرام)
  const socials = [
    { platform: 'INSTAGRAM', title: 'اینستاگرام رسمی', url: 'https://instagram.com/caroption_ir', username: '@caroption_ir', icon: 'Instagram' },
    { platform: 'TELEGRAM', title: 'کانال تلگرام استعلام و نمونه‌کار', url: 'https://t.me/caroption_channel', username: '@caroption_channel', icon: 'Send' },
    { platform: 'EITAA', title: 'کانال رسمی در پیام‌رسان ایتا', url: 'https://eitaa.com/caroption', username: '@caroption', icon: 'MessageCircle' },
    { platform: 'RUBIKA', title: 'کانال رسمی روبیکا', url: 'https://rubika.ir/caroption', username: '@caroption', icon: 'Radio' },
    { platform: 'WHATSAPP', title: 'پشتیبانی فنی واتساپ', url: 'https://wa.me/989121111111', username: '09121111111', icon: 'Phone' },
  ];

  for (let i = 0; i < socials.length; i++) {
    await prisma.socialLink.create({
      data: { ...socials[i], orderIndex: i + 1 },
    });
  }

  // 12. ساعات کاری هفته (برای وضعیت «اکنون باز است / بسته است»)
  const days = [
    { dayOfWeek: 0, dayName: 'شنبه', openTime: '09:00', closeTime: '20:30', isOpen: true },
    { dayOfWeek: 1, dayName: 'یکشنبه', openTime: '09:00', closeTime: '20:30', isOpen: true },
    { dayOfWeek: 2, dayName: 'دوشنبه', openTime: '09:00', closeTime: '20:30', isOpen: true },
    { dayOfWeek: 3, dayName: 'سه‌شنبه', openTime: '09:00', closeTime: '20:30', isOpen: true },
    { dayOfWeek: 4, dayName: 'چهارشنبه', openTime: '09:00', closeTime: '20:30', isOpen: true },
    { dayOfWeek: 5, dayName: 'پنج‌شنبه', openTime: '09:00', closeTime: '17:00', isOpen: true },
    { dayOfWeek: 6, dayName: 'جمعه', openTime: '10:00', closeTime: '14:00', isOpen: false },
  ];

  for (const day of days) {
    await prisma.workingHours.create({ data: day });
  }

  // 13. سوالات و دانش پایگاه داده Chatbot هوشمند
  await prisma.chatbotFAQ.createMany({
    data: [
      {
        question: 'آیا نصب آبشن باعث باطل شدن گارانتی کارخانه ایران‌خودرو یا سایپا می‌شود؟',
        answer: 'خیر، تمامی تجهیزات ارائه شده در این مجموعه به‌صورت سوکت به سوکت (Plug & Play) و بدون هرگونه سیم‌کشی دستی یا برش درخت‌سیم خودرو نصب می‌شوند؛ بنابراین گارانتی خودرو کاملاً معتبر باقی می‌ماند.',
        keywords: 'گارانتی,ابطال,ایران خودرو,سایپا,سوکت فابریک,سیم کشی',
        category: 'INSTALLATION',
        orderIndex: 1,
      },
      {
        question: 'فرآیند ثبت درخواست و قیمت‌گذاری به چه صورت است؟',
        answer: 'این پلتفرم فروشگاه اینترنتی معمولی با خرید کارت‌بانکی مستقیم نیست. شما پس از انتخاب خودرو و آبشن مورد نظر، فرم درخواست سفارش یا استعلام قیمت را ثبت می‌کنید. کارشناسان فنی ما برای هماهنگی و بررسی جزئیات در ساعات انتخابی با شما تماس می‌گیرند.',
        keywords: 'سفارش,خرید,پرداخت,سبد خرید,استعلام,قیمت',
        category: 'ORDER',
        orderIndex: 2,
      },
      {
        question: 'چگونه مطمئن شوم آبشن برای مدل و سال خودروی من مناسب است؟',
        answer: 'در هوم‌پیج یا صفحه فیلترها، کافیست برند، مدل، تیپ و سال خودروی خود را انتخاب کنید (یا به بخش "خودروی من" اضافه کنید). تمام آبشن‌های سازگار و شرایط نصب به صورت تفکیک‌شده به شما نشان داده خواهند شد.',
        keywords: 'سازگاری,خودروی من,سال,تیپ,مدل',
        category: 'COMPATIBILITY',
        orderIndex: 3,
      },
    ],
  });

  console.log('--- داده‌های بذر اولیه با موفقیت ثبت شدند ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
