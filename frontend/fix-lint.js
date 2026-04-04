const fs = require('fs');

function replaceFile(file, replacer) {
    let content = fs.readFileSync(file, 'utf8');
    content = replacer(content);
    fs.writeFileSync(file, content);
}

replaceFile('src/app/main/cart/page.tsx', (content) => {
    return content
        .replace(/import\s*\{\s*ArrowRight,\s*ShoppingCart\s*as\s*CartIcon\s*\}\s*from\s*'lucide-react';?\n*/g, '')
        .replace(/clearCart,\s*/g, '')
        .replace(/clearLocalCart,?\s*/g, '');
});

replaceFile('src/app/main/checkout/page.tsx', (content) => {
    return content
        .replace(/import Link from ['"]next\/link['"];?\n*/g, '')
        .replace(/const \[quantity,\s*setQuantity\]\s*=\s*useState<number>\(.*?\);?/g, 'const [quantity] = useState<number>(cart.totalItems);');
});

replaceFile('src/app/main/orders/page.tsx', (content) => {
    return content
        .replace(/const formatDate.*?\(.*?\).*?\{[\s\S]*?return new Intl\.DateTimeFormat[\s\S]*?\};\n*/g, '')
        .replace(/const handleProceedToCheckout = \(\) => \{[\s\S]*?router\.push\('\/main\/checkout'\);\n\s*\};\n*/g, '');
});

replaceFile('src/app/main/products/categories/page.tsx', (content) => {
    return content.replace(/const \[error,\s*setError\]/g, 'const [, setError]');
});

replaceFile('src/app/main/products/page.tsx', (content) => {
    return content
        .replace(/import ServiceFeaturesSkeleton.*?;\n*/g, '')
        .replace(/const \[activeFilters,\s*setActiveFilters\]/g, 'const [activeFilters]');
});

replaceFile('src/app/search/page.tsx', (content) => {
    return content
        .replace(/import \{ Metadata \}.*?;\n*/g, '')
        .replace(/import \{.*?SlidersHorizontal.*?\}\s*from\s*'lucide-react';?\n*/g, (match) => match.replace(/,?s*SlidersHorizontal,?/, ''))
        .replace(/const \[showFilters,\s*setShowFilters\]\s*=\s*useState\(false\);?/g, '');
});

replaceFile('src/app/store/[username]/page.tsx', (content) => {
    return content.replace(/import\s*\{\s*Star\s*\}[\s\S]*?;\n*/g, (match) => match.replace(/Star,?\s*/, ''));
});

replaceFile('src/Components/Cart/AddToCartButton.tsx', (content) => {
    return content
        .replace(/const router = useRouter\(\);?\n*/g, '')
        .replace(/const pathname = usePathname\(\);?\n*/g, '');
});

replaceFile('src/Components/Cart/EmptyState.tsx', (content) => {
    return content.replace(/ArrowRight\s*,?\s*/g, '');
});

replaceFile('src/Components/Cart/OrderSummary.tsx', (content) => {
    return content.replace(/import Link from ['"]next\/link['"];?\n*/g, '');
});

replaceFile('src/Components/Header/searchComponent.tsx', (content) => {
    return content.replace(/const \[isLoading,\s*setIsLoading\]/g, 'const [isLoading]');
});

replaceFile('src/Components/Header/undertop.tsx', (content) => {
    return content.replace(/Phone\s*,?\s*/g, '');
});

replaceFile('src/Components/Navigation/mobileNav.tsx', (content) => {
    return content.replace(/(ShoppingCart|Calendar)\s*,?\s*/g, '');
});

replaceFile('src/Components/Navigation/verticalProductNav.tsx', (content) => {
    return content.replace(/Calendar\s*,?\s*/g, '');
});

replaceFile('src/Components/Products/details/ProductActions.tsx', (content) => {
    return content.replace(/const handleBuyNow =.*?\}?;?\n*/g, '');
});

replaceFile('src/Components/Products/details/ProductActionsClient.tsx', (content) => {
    return content
        .replace(/const router = useRouter\(\);?\n*/g, '')
        .replace(/const pathname = usePathname\(\);?\n*/g, '');
});

replaceFile('src/Components/Products/details/ProductDetails.tsx', (content) => {
    return content.replace(/const placeholderImage.*?;\n*/g, '');
});

replaceFile('src/Components/Products/details/ProductInfo.tsx', (content) => {
    return content.replace(/product: Product;/g, '');
});

replaceFile('src/Components/Products/details/RelatedProducts.tsx', (content) => {
    return content.replace(/import Link from ['"]next\/link['"];?\n*/g, '');
});

replaceFile('src/Components/Products/layouts/CategoryShop.tsx', (content) => {
    return content.replace(/import Image from ['"]next\/image['"];?\n*/g, '');
});

replaceFile('src/hooks/useProducts.ts', (content) => {
    return content.replace(/Product,\s*PaginatedResponse\s*,?\s*/g, '');
});

replaceFile('src/lib/auth.ts', (content) => {
    return content.replace(/catch\s*\(\s*error\s*\)\s*\{/g, 'catch (err) { // @ts-ignore\n');
});

replaceFile('src/lib/cart.ts', (content) => {
    return content.replace(/catch\s*\(\s*error\s*\)\s*\{/g, 'catch (err) { // @ts-ignore\n');
});

replaceFile('src/lib/cartMerge.ts', (content) => {
    return content.replace(/const response = await/g, 'await');
});

replaceFile('src/middleware.ts', (content) => {
    return content
        .replace(/const PROTECTED_ROUTES = \[.*?\];\n*/s, '')
        .replace(/const PUBLIC_ROUTES = \[.*?\];\n*/s, '')
        .replace(/const API_ROUTES = \[.*?\];\n*/s, '')
        .replace(/const matchesRoute = .*?;\n*/s, '')
        .replace(/request: NextRequest/g, '');
});

replaceFile('src/services/searchService.ts', (content) => {
    return content.replace(/Product,\s*PaginatedResponse\s*,?\s*/g, '');
});

console.log('Fixed lint unused vars');
