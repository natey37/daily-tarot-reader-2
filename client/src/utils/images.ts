export function preloadImages(cardUrls: string[]) {
    cardUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }
  