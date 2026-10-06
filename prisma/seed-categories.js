const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- افزودن دسته‌بندی‌های کامل خودرویی ---');

  const categories = [
    {
      nameFa: 'سیستم‌های تصویری و چندرسانه‌ای',
      slug: 'multimedia-displays',
      icon: 'Tv',
      orderIndex: 1,
      children: [
        { nameFa: 'مانیتور اندروید فابریک خودرو', slug: 'android-monitors' },
        { nameFa: 'دوربین ۳۶۰ درجه پرنده‌ای 3D', slug: '360-cameras' },
        { nameFa: 'دوربین دید در شب دنده عقب و جلو', slug: 'reverse-cameras' },
        { nameFa: 'مانیتورهای پشت‌سری سرنشینان', slug: 'headrest-monitors' },
      ],
    },
    {
      nameFa: 'تجهیزات ایمنی و کمک راننده',
      slug: 'safety-assistance',
      icon: 'ShieldCheck',
      orderIndex: 2,
      children: [
        { nameFa: 'کروز کنترل هوشمند و لیمیتر سرعت', slug: 'cruise-control-systems' },
        { nameFa: 'سنسورهای پارک فابریک جلو و عقب', slug: 'parking-sensors' },
        { nameFa: 'ردیاب ماهواره‌ای و GPS ضد سرقت', slug: 'gps-trackers' },
        { nameFa: 'رادار نقطه کور (Blind Spot Radar)', slug: 'blind-spot-radar' },
        { nameFa: 'سیستم پایش باد تایر (TPMS)', slug: 'tire-pressure-tpms' },
      ],
    },
    {
      nameFa: 'تجهیزات رفاهی و آسایش',
      slug: 'comfort-electronics',
      icon: 'Sparkles',
      orderIndex: 3,
      children: [
        { nameFa: 'کلاچ اتوماتیک هوشمند برقی', slug: 'smart-auto-clutch-sys' },
        { nameFa: 'نرم‌کننده کلاچ استاندارد فابریک', slug: 'clutch-softener' },
        { nameFa: 'پاور ویندوز و آینه تاشو برقی', slug: 'power-windows-mirrors' },
        { nameFa: 'کی‌لس استارت و دکمه استارت هوشمند', slug: 'keyless-engine-start' },
        { nameFa: 'گرم‌کن و سرد‌کن فابریک صندلی', slug: 'seat-heaters' },
      ],
    },
    {
      nameFa: 'سیستم‌های صوتی حرفه‌ای',
      slug: 'audio-sound-systems',
      icon: 'Headphones',
      orderIndex: 4,
      children: [
        { nameFa: 'اسپیکرها و کامپوننت‌های فابریک', slug: 'car-speakers' },
        { nameFa: 'ساب‌ووفر و آمپلی‌فایر دیجیتال', slug: 'subwoofers-amplifiers' },
        { nameFa: 'پردازنده‌های دیجیتال صدا (DSP)', slug: 'dsp-sound-processors' },
      ],
    },
    {
      nameFa: 'روشنایی و تجهیزات بدنه',
      slug: 'lighting-body-options',
      icon: 'Zap',
      orderIndex: 5,
      children: [
        { nameFa: 'هدلایت‌های پرتوان ضد خطا (Canbus)', slug: 'led-headlights' },
        { nameFa: 'جک برقی صندوق عقب با سنسور پا', slug: 'electric-tailgate' },
        { nameFa: 'چراغ خوش‌آمدگویی زیر درب (Logo Projector)', slug: 'welcome-door-lights' },
        { nameFa: 'تقویت‌کننده و بهینه‌ساز کولر خودرو', slug: 'ac-boosters' },
      ],
    },
  ];

  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameFa: cat.nameFa, icon: cat.icon, orderIndex: cat.orderIndex },
      create: { nameFa: cat.nameFa, slug: cat.slug, icon: cat.icon, orderIndex: cat.orderIndex },
    });

    for (const sub of cat.children) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { nameFa: sub.nameFa, parentId: parent.id },
        create: { nameFa: sub.nameFa, slug: sub.slug, parentId: parent.id },
      });
    }
  }

  console.log('--- دسته‌بندی‌های جامع با موفقیت افزوده شدند ---');
}

main().finally(() => prisma.$disconnect());
