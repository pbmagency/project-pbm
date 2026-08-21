import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = 'public/assets';

async function optimizeImage(inputPath) {
    const ext = extname(inputPath).toLowerCase();
    const name = basename(inputPath, ext);
    
    try {
        if (ext === '.png') {
            // Convert PNG → WebP (much smaller)
            const outputPath = join(PUBLIC_DIR, `${name}.webp`);
            const beforeSize = (await stat(inputPath)).size;
            
            await sharp(inputPath)
                .webp({ quality: 85, effort: 6 })
                .toFile(outputPath);
            
            const afterSize = (await stat(outputPath)).size;
            const saved = ((1 - afterSize / beforeSize) * 100).toFixed(1);
            console.log(`✅ ${name}.png → .webp (${(beforeSize/1024).toFixed(0)}KB → ${(afterSize/1024).toFixed(0)}KB, -${saved}%)`);
        }
        
        if (ext === '.jpeg' || ext === '.jpg') {
            // Compress JPEG
            const inputSize = (await stat(inputPath)).size;
            
            const tempPath = join(PUBLIC_DIR, `${name}_temp.webp`);
            await sharp(inputPath)
                .webp({ quality: 80, effort: 6 })
                .toFile(tempPath);
            
            const outputSize = (await stat(tempPath)).size;
            
            // Replace original
            const { rename, unlink } = await import('fs/promises');
            await unlink(inputPath);
            await rename(tempPath, inputPath.replace(ext, '.webp'));
            
            const saved = ((1 - outputSize / inputSize) * 100).toFixed(1);
            console.log(`✅ ${name}${ext} → .webp (${(inputSize/1024).toFixed(0)}KB → ${(outputSize/1024).toFixed(0)}KB, -${saved}%)`);
        }
    } catch (err) {
        console.error(`❌ Failed: ${name}${ext} - ${err.message}`);
    }
}

// Also compress existing large WebP files
async function recompressWebP(inputPath) {
    const name = basename(inputPath, '.webp');
    const inputSize = (await stat(inputPath)).size;
    
    // Only recompress if > 100KB
    if (inputSize < 100 * 1024) return;
    
    try {
        const tempPath = join(PUBLIC_DIR, `${name}_temp.webp`);
        await sharp(inputPath)
            .webp({ quality: 75, effort: 6 })
            .toFile(tempPath);
        
        const outputSize = (await stat(tempPath)).size;
        if (outputSize < inputSize) {
            const { rename, unlink } = await import('fs/promises');
            await unlink(inputPath);
            await rename(tempPath, inputPath);
            
            const saved = ((1 - outputSize / inputSize) * 100).toFixed(1);
            console.log(`✅ ${name}.webp recompressed (${(inputSize/1024).toFixed(0)}KB → ${(outputSize/1024).toFixed(0)}KB, -${saved}%)`);
        } else {
            const { unlink } = await import('fs/promises');
            await unlink(tempPath);
            console.log(`⏭️  ${name}.webp already optimal`);
        }
    } catch (err) {
        console.error(`❌ Failed recompress: ${name}.webp - ${err.message}`);
    }
}

async function main() {
    console.log('🖼️  Optimizing images in public/assets/...\n');
    
    const files = await readdir(PUBLIC_DIR);
    
    for (const file of files) {
        const ext = extname(file).toLowerCase();
        const fullPath = join(PUBLIC_DIR, file);
        
        if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
            await optimizeImage(fullPath);
        } else if (ext === '.webp') {
            await recompressWebP(fullPath);
        }
    }
    
    // Also process images/study-case and images/testimonials
    for (const subdir of ['images/study-case', 'images/testimonials', 'images/benefits']) {
        try {
            const subFiles = await readdir(subdir);
            for (const file of subFiles) {
                const ext = extname(file).toLowerCase();
                const fullPath = join(subdir, file);
                
                if (ext === '.webp') {
                    await recompressWebP(fullPath);
                }
            }
        } catch (e) {
            // Skip missing dirs
        }
    }
    
    console.log('\n✨ Done!');
}

main().catch(console.error);
