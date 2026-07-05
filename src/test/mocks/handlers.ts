import { http, HttpResponse } from 'msw';
import { mockUser, mockProducts, mockCategories, mockCoupons, mockOrder } from '../fixtures';

const API_URL = 'https://api.jnan-store.com/v1';

export const handlers = [
  // Authentication Endpoints
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email === 'test@example.com' && body.password === 'Password123!') {
      return HttpResponse.json({
        user: mockUser,
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
    }
    return new HttpResponse(
      JSON.stringify({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }),

  http.post(`${API_URL}/auth/register`, async () => {
    return HttpResponse.json({
      email: 'test@example.com',
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح (استخدم الرمز: 123456)',
    });
  }),

  http.post(`${API_URL}/auth/verify`, async ({ request }) => {
    const body = (await request.json()) as { token?: string; otpCode?: string };
    if (body.token === '123456' || body.otpCode === '123456') {
      return HttpResponse.json({
        user: mockUser,
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      });
    }
    return new HttpResponse(JSON.stringify({ message: 'رمز التحقق غير صحيح أو انتهت صلاحيته' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }),

  http.post(`${API_URL}/auth/forgot-password`, async () => {
    return HttpResponse.json({
      email: 'test@example.com',
      message: 'تم إرسال رمز إعادة التعيين بنجاح (استخدم الرمز: 123456)',
    });
  }),

  http.post(`${API_URL}/auth/reset-password`, async ({ request }) => {
    const body = (await request.json()) as { otpCode?: string };
    if (body.otpCode === '123456') {
      return HttpResponse.json({ success: true });
    }
    return new HttpResponse(JSON.stringify({ message: 'رمز التحقق غير صحيح أو انتهت صلاحيته' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }),

  http.get(`${API_URL}/auth/profile`, () => {
    return HttpResponse.json(mockUser);
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  // Products Endpoints
  http.get(`${API_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';

    let filtered = [...mockProducts];
    if (search) {
      filtered = filtered.filter(
        (p) => p.nameEn.toLowerCase().includes(search.toLowerCase()) || p.nameAr.includes(search)
      );
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === category);
    }

    return HttpResponse.json({
      success: true,
      data: filtered,
      pagination: {
        page: 1,
        limit: 10,
        totalItems: filtered.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  }),

  http.get(`${API_URL}/products/:idOrSlug`, ({ params }) => {
    const { idOrSlug } = params;
    const product = mockProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (product) {
      return HttpResponse.json(product);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_URL}/categories`, () => {
    return HttpResponse.json(mockCategories);
  }),

  // Coupon Endpoints
  http.post(`${API_URL}/coupons/validate`, async ({ request }) => {
    const body = (await request.json()) as { code: string; subtotal: number };
    const coupon = mockCoupons.find((c) => c.code === body.code.toUpperCase());
    if (coupon) {
      if (coupon.minOrderValue && body.subtotal < coupon.minOrderValue) {
        return new HttpResponse(
          JSON.stringify({
            message: `الكوبون يتطلب حد أدنى للطلب بقيمة ${coupon.minOrderValue} ر.س`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return HttpResponse.json(coupon);
    }
    return new HttpResponse(JSON.stringify({ message: 'رمز الكوبون غير صحيح أو انتهت صلاحيته' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }),

  // Orders Endpoints
  http.post(`${API_URL}/orders`, async () => {
    return HttpResponse.json(mockOrder);
  }),
];
