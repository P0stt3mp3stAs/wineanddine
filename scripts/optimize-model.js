const gltfPipeline = require('gltf-pipeline');
const fsExtra = require('fs-extra');
const path = require('path');

const options = {
  dracoOptions: {
    compressionLevel: 7,
    quantizePositionBits: 14,
    quantizeNormalBits: 10,
    quantizeTexcoordBits: 12,
    quantizeColorBits: 10,
    uncompressedFallback: true,
    fallbackType: 'ASCII'
  }
};

async function optimizeModel() {
  try {
    console.log('Starting model optimization...');
    
    const inputPath = path.join(process.cwd(), 'public', 'models', 'xybar2.gltf');
    const outputPath = path.join(process.cwd(), 'public', 'models', 'xybar2.optimized.gltf');
    
    const gltf = fsExtra.readFileSync(inputPath);
    console.log('Model file read successfully');
    
    const results = await gltfPipeline.glbToGltf(gltf, options);
    console.log('Model optimized successfully');
    
    fsExtra.writeFileSync(outputPath, results.gltf);
    console.log('Optimized model saved successfully');
    
  } catch (error) {
    console.error('Error optimizing model:', error);
  }
}

optimizeModel();