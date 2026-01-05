/**
 * Performance optimization utilities
 */

/**
 * Preloads critical resources
 * @param resources Array of resources to preload
 */
export const preloadResources = (resources: Array<{ url: string; as: string }>) => {
  resources.forEach(({ url, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  });
};

/**
 * Adds resource hints for DNS prefetching and preconnect
 * @param domains Array of domains to prefetch/preconnect
 */
export const addResourceHints = (domains: string[]) => {
  domains.forEach(domain => {
    // DNS prefetch
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = domain;
    document.head.appendChild(dnsPrefetch);

    // Preconnect
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = domain;
    document.head.appendChild(preconnect);
  });
};

/**
 * Optimizes images by converting to WebP format
 * @param imageUrl Original image URL
 * @returns WebP version of the image URL
 */
export const getOptimizedImageUrl = (imageUrl: string): string => {
  // If the image is already WebP, return as is
  if (imageUrl.endsWith('.webp')) {
    return imageUrl;
  }

  // If using a CDN that supports automatic WebP conversion, append format parameter
  // Example: Cloudinary, Imgix, etc.
  if (imageUrl.includes('cloudinary.com')) {
    return `${imageUrl}/f_auto,q_auto`;
  }

  // Return original URL if no optimization is possible
  return imageUrl;
};

/**
 * Measures and reports LCP
 */
export const measureLCP = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Report LCP to analytics or monitoring service
  
      
      // You can send this to your analytics service
      // analytics.track('LCP', { value: lastEntry.startTime });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
}; 