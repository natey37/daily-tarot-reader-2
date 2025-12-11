import express from 'express';
import { createCanvas, loadImage } from 'canvas';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { cards, reading, date } = req.body;
    
    // Calculate content height first to center everything
    const canvas = createCanvas(1200, 1800);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 1200, 1800);
    
    // Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 1192, 1792);
    
    // Card dimensions
    const cardWidth = 280;
    const cardHeight = 420;
    const cardGap = 30;
    const totalCardsWidth = (cardWidth * 3) + (cardGap * 2);
    
    // Calculate text height first to know total content height
    const maxWidth = totalCardsWidth;
    const lineHeight = 32;
    const paragraphs = reading.split('\n\n');
    let textHeight = 0;
    
    ctx.font = '20px sans-serif';
    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let line = '';
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
          textHeight += lineHeight;
          line = word + ' ';
        } else {
          line = testLine;
        }
      });
      
      if (line.trim()) {
        textHeight += lineHeight;
      }
      textHeight += lineHeight * 0.4; // Paragraph spacing
    });
    
    // Total content height
    const titleHeight = 70;
    const titleToCardsGap = 40;
    const cardsToTextGap = 50;
    const totalContentHeight = titleHeight + titleToCardsGap + cardHeight + cardsToTextGap + textHeight;
    
    // Center everything vertically
    const startY = (1800 - totalContentHeight) / 2;
    
    // Title
    ctx.fillStyle = '#9C8FFF';
    ctx.font = 'bold 42px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Daily Tarot Reader - ${date}`, 600, startY);
    
    // Load and draw card images
    const cardImages = await Promise.all(
      cards.map(card => loadImage(card.image))
    );
    
    const cardsStartX = (1200 - totalCardsWidth) / 2;
    const cardsY = startY + titleToCardsGap;
    
    cardImages.forEach((img, i) => {
      const x = cardsStartX + (i * (cardWidth + cardGap));
      ctx.drawImage(img, x, cardsY, cardWidth, cardHeight);
    });
    
    // Reading text
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    
    const textStartX = cardsStartX;
    let y = cardsY + cardHeight + cardsToTextGap;
    
    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let line = '';
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
          ctx.fillText(line, textStartX, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      });
      
      if (line.trim()) {
        ctx.fillText(line, textStartX, y);
        y += lineHeight;
      }
      
      y += lineHeight * 0.4;
    });
    
    // Send as PNG
    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
    
  } catch (error) {
    console.error('Failed to generate image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

export default router