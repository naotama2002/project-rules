import { generateMdcFiles } from './cursor';
import { generateClineFile } from './cline';

// メイン処理
async function main() {
  try {
    // MDCファイルの生成
    await generateMdcFiles()

    // Clineファイルの生成
    await generateClineFile()

    console.log('All mdc files have been successfully generated!');
  } catch (error) {
    console.error('Error generating mdc files:', error);
    process.exit(1);
  }
}

// スクリプトの実行
main();
