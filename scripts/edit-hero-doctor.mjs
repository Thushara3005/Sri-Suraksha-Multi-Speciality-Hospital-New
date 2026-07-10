import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function editDoctorImage() {
  const zai = await ZAI.create();
  
  // Read the woman's image and convert to base64 data URL
  const imgBuffer = fs.readFileSync('/home/z/my-project/upload/pasted_image_1783700111851.jpg');
  const base64 = imgBuffer.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64}`;
  
  console.log('Starting AI image edit...');
  
  const response = await zai.images.generations.edit({
    prompt: `Professional medical portrait of a woman doctor wearing a pink floral garment, pink scarf, black-framed glasses, and a stethoscope around her neck. Clean solid white background. Head and shoulders portrait crop from mid-chest up, face centered. Studio-quality professional headshot lighting. The woman should be looking at camera with a warm professional smile. High quality medical professional photograph suitable for a hospital website hero section circular frame. Keep the exact same person, same clothing, same accessories, same glasses. Make it look like an official hospital website profile photo.`,
    images: [{ url: dataUrl }],
    size: '864x1152'
  });
  
  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  
  fs.writeFileSync('/home/z/my-project/public/images/hero-doctor.png', buffer);
  console.log(`✓ Edited hero-doctor.png saved (${buffer.length} bytes)`);
}

editDoctorImage().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
