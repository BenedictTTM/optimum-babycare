const fs = require('fs');

function replaceFile(file, replacer) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = replacer(content);
    fs.writeFileSync(file, content);
}

replaceFile('src/app/main/cart/page.tsx', c => c.replace(/,\s*clearCart/g, ''));
replaceFile('src/app/main/checkout/page.tsx', c => c.replace(/const quantityParam = searchParams\.get\('quantity'\);\n*/g, ''));
replaceFile('src/app/main/orders/page.tsx', c => c.replace(/const formatDate =[\s\S]*?return new Intl\.DateTimeFormat.*?\};\n/g, '').replace(/const handleProceedToCheckout =[\s\S]*?router\.push\('\/main\/checkout'\);\n\s*\};\n/g, ''));
replaceFile('src/app/main/products/page.tsx', c => c.replace(/const ServiceFeaturesSkeleton.*?\};\n/g, ''));
replaceFile('src/app/store/[username]/page.tsx', c => c.replace(/Star,?\s*/g, ''));
replaceFile('src/Components/Cart/AddToCartButton.tsx', c => c.replace(/useRouter,\s*usePathname\s*,?\s*/g, ''));
replaceFile('src/Components/Products/details/ProductActions.tsx', c => c.replace(/handleBuyNow\s*\}\s*;\n*/g, '}\n').replace(/handleBuyNow;/g, ''));
replaceFile('src/Components/Products/details/ProductActionsClient.tsx', c => c.replace(/useRouter,\s*usePathname\s*,?\s*/g, ''));
replaceFile('src/Components/Products/details/ProductInfo.tsx', c => c.replace(/Product,\s*/g, '').replace(/product,\s*/g, ''));
replaceFile('src/lib/auth.ts', c => c.replace(/\/\/\s*@ts-expect-error/g, '').replace(/\/\/\s*@ts-ignore/g, '').replace(/catch\s*\(err\)\s*\{/g, 'catch {'));
replaceFile('src/lib/cart.ts', c => c.replace(/\/\/\s*@ts-expect-error/g, '').replace(/\/\/\s*@ts-ignore/g, '').replace(/catch\s*\(err\)\s*\{/g, 'catch {'));
replaceFile('src/middleware.ts', c => c.replace(/NextResponse,\s*NextRequest\s*/g, 'NextResponse ').replace(/NextRequest,\s*/g, '').replace(/const matchesRoute[\s\S]*?return path === route;\n\s*\};\n/g, ''));

console.log('Fixed more vars');
