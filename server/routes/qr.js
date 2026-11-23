import { Router } from 'express';
import QRCode from 'qrcode';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { beds, property, baseUrl } = req.body;

    if (!Array.isArray(beds) || beds.length === 0) {
      return res.status(400).json({ error: 'beds must be a non-empty array' });
    }
    if (!property || typeof property !== 'string') {
      return res.status(400).json({ error: 'property is required' });
    }
    if (!baseUrl || typeof baseUrl !== 'string') {
      return res.status(400).json({ error: 'baseUrl is required' });
    }

    const results = await Promise.all(
      beds.map(async (bed) => {
        const url = `${baseUrl}?bed=${encodeURIComponent(bed)}&property=${encodeURIComponent(property)}`;
        const qrDataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 });
        return { bed, qrDataUrl };
      })
    );

    return res.json(results);
  } catch (err) {
    console.error('[qr] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
