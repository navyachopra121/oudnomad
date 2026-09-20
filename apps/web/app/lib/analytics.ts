'use client';

export type EcommerceEvent =
  | {
      name: 'view_item';
      params: {
        id: string;
        name: string;
        price: number;
        category?: string;
        variant?: string;
      };
    }
  | {
      name: 'add_to_cart';
      params: {
        id: string;
        name: string;
        price: number;
        variant?: string;
        quantity: number;
      };
    }
  | {
      name: 'begin_checkout';
      params: {
        value: number;
        itemsCount: number;
      };
    }
  | {
      name: 'purchase';
      params: {
        orderId: string;
        value: number;
        items: Array<{
          name: string;
          price: number;
          quantity: number;
        }>;
      };
    };

export function trackEvent(event: EcommerceEvent) {
  if (typeof window === 'undefined') return;

  // Log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Atelier Analytics] ${event.name}:`, event.params);
  }

  // Google Tag Manager / GA4 dataLayer
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: event.name,
      ecommerce: event.params,
    });
  }

  // Meta Pixel (fbq)
  if (typeof (window as any).fbq === 'function') {
    if (event.name === 'view_item') {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [event.params.id],
        content_name: event.params.name,
        value: event.params.price,
        currency: 'USD',
      });
    } else if (event.name === 'add_to_cart') {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [event.params.id],
        content_name: event.params.name,
        value: event.params.price,
        currency: 'USD',
      });
    } else if (event.name === 'begin_checkout') {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: event.params.value,
        num_items: event.params.itemsCount,
        currency: 'USD',
      });
    } else if (event.name === 'purchase') {
      (window as any).fbq('track', 'Purchase', {
        value: event.params.value,
        currency: 'USD',
      });
    }
  }
}
