export default function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      if (location.protocol.toLowerCase() === 'https:' || location.host.toLowerCase().indexOf('localhost') > -1) {
        navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`, { scope: '/' });
        console.log('Loaded service worker');
      }
    });
  }
}