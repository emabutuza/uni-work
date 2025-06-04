import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyImages = async () => {
  try {
    // Source directory (FlowerMarket)
    const sourceDir = path.join(__dirname, '../../../FlowerMarket');
    
    // Destination directory (uploads)
    const destDir = path.join(__dirname, '../../../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Read all image files
    const imageFiles = fs.readdirSync(sourceDir)
      .filter(file => file.match(/\.(jpeg|jpg|png)$/i));

    console.log(`Found ${imageFiles.length} image files`);

    // Copy each image to the uploads directory
    for (const file of imageFiles) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file}`);
    }

    console.log('Image copy completed successfully');
  } catch (error) {
    console.error('Error copying images:', error);
  }
};

// Run the copy
copyImages(); 