const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  if (products.length === 0) {
    console.log('No products found');
    return;
  }

  const sampleReviews = [
    {
      productId: products[0].id,
      authorName: 'مهندس علیرضا رضایی',
      rating: 5,
      comment: 'روی دنا پلاس نصب کردم. عملکرد کروز کنترل در اتوبان فوق‌العاده نرم و بی‌نقص هست. بدون هیچ تداخل یا دستکاری در سیم‌کشی نصب شد.',
      isVerifiedCustomer: true,
      isApproved: true,
    },
    {
      productId: products[0].id,
      authorName: 'مسعود فراهانی',
      rating: 5,
      comment: 'کیفیت ساخت کلیدهای روی فرمان بسیار عالیه و تفاوتی با نسخه فابریک کارخانه نداره. رفتار تیم فنی و نحوه نصب بسیار حرفه‌ای بود.',
      isVerifiedCustomer: true,
      isApproved: true,
    },
    {
      productId: products.length > 1 ? products[1].id : products[0].id,
      authorName: 'کامران حسینی',
      rating: 4,
      comment: 'مانیتور تارا سرعت پاسخگویی لمسی بسیار بالایی داره و کیفیت صفحه در تابش مستقیم آفتاب عالی دیده میشه. اتصال به کنترل فرمان هم بدون تاخیر کار می‌کنه.',
      isVerifiedCustomer: true,
      isApproved: true,
    },
  ];

  for (const rev of sampleReviews) {
    await prisma.review.create({ data: rev });
  }

  console.log('Successfully seeded initial customer reviews');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
