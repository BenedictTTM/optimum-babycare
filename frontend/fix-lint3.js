const fs = require('fs');

function replaceFile(file, replacer) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = replacer(content);
    fs.writeFileSync(file, content);
}

replaceFile('src/app/main/checkout/page.tsx', c => {
    return c.replace(/const quantityParam = searchParams\.get\("quantity"\);\n*/g, '')
        .replace(/const \[quantity,\s*setQuantity\]\s*=\s*useState<number>\(parseInt\(quantityParam/g, 'const [quantity, setQuantity] = useState<number>(parseInt(searchParams.get("quantity")');
});

replaceFile('src/app/main/orders/page.tsx', c => {
    return c.replace(/const formatDate =[\s\S]*?return new Intl\.DateTimeFormat.*?\};\n?/g, '')
        .replace(/const handleProceedToCheckout =[\s\S]*?router\.push\('\/main\/checkout'\);\n\s*\};\n?/g, '');
});

replaceFile('src/app/main/products/page.tsx', c => {
    return c.replace(/const ServiceFeaturesSkeleton.*?\};\n/g, '');
});

replaceFile('src/Components/Products/details/ProductActions.tsx', c => {
    return c.replace(/handleBuyNow;\n/g, '').replace(/const handleBuyNow\s*=\s*\(\)\s*=>\s*\{\s*\}?;?/g, '');
});

replaceFile('src/Components/Products/details/ProductInfo.tsx', c => {
    return c.replace(/import \{ Product \} from.*?;\n/, '');
});

replaceFile('src/middleware.ts', c => {
    return c.replace(/NextRequest,\s*/, '').replace(/import \{.*?NextRequest.*?\} from 'next\/server';/, "import { NextResponse } from 'next/server';").replace(/const matchesRoute =[\s\S]*?return path === route;\n\s*\};\n/, '');
});

replaceFile('src/app/main/orders/[id]/pay/page.tsx', c => {
    if (c.includes('loadOrder();')) {
        // move loadOrder inside useEffect
        c = c.replace(/const loadOrder = async \(\) => \{[\s\S]*?setLoading\(false\);\n\s*\};/, '');
        c = c.replace(/loadOrder\(\);\n\s*\}, \[orderId\]\);/, "const loadOrder = async () => { try { const response = await apiClient.get(`/orders/${orderId}`); const data = response.data?.data || response.data; setOrder(data); if (data.paymentStatus === 'UNPAID') setShowPaymentModal(true); } catch (err: any) { console.error('Failed to load order:', err); setError(err?.response?.data?.message || (err instanceof Error ? err.message : 'Failed to load order')); } finally { setLoading(false); } }; loadOrder(); }, [orderId]);");
    }
    return c;
});

console.log('Fixed final lints pt 3');
