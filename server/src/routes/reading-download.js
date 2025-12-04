import express from 'express';
import { createCanvas, loadImage } from 'canvas';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { cards, reading, date } = req.body;
    
    // Smaller canvas for better mobile viewing
    const canvas = createCanvas(1200, 1800);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 1200, 1800);
    
    // Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 1192, 1792);
    
    // Title
    ctx.fillStyle = '#9C8FFF';
    ctx.font = 'bold 42px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Daily Tarot Reader - ${date}`, 600, 70);
    
    // Load and draw card images - larger and centered
    const cardImages = await Promise.all(
      cards.map(card => loadImage(card.image))
    );
    
    const cardWidth = 280;
    const cardHeight = 420;
    const cardGap = 30;
    const totalCardsWidth = (cardWidth * 3) + (cardGap * 2);
    const cardsStartX = (1200 - totalCardsWidth) / 2;
    
    cardImages.forEach((img, i) => {
      const x = cardsStartX + (i * (cardWidth + cardGap));
      ctx.drawImage(img, x, 110, cardWidth, cardHeight);
    });
    
    // Reading text - align with left edge of cards
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    
    const textStartX = cardsStartX; // Align with cards left edge
    const maxWidth = totalCardsWidth; // Same width as cards
    const lineHeight = 32;
    const startY = 580;
    
    // Split into paragraphs
    const paragraphs = reading.split('\n\n');
    let y = startY;
    
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
      
      // Print last line of paragraph
      if (line.trim()) {
        ctx.fillText(line, textStartX, y);
        y += lineHeight;
      }
      
      // Extra space between paragraphs
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