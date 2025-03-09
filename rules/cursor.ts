import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';
import { extractNumberPrefix } from './util';

// mdcファイルとmdディレクトリの対応関係の定義
const mdcConfigurations = [
  {
    output: ".cursor/rules/000_general.mdc",
    sourceDir: "rules/general",
    header: "", // もしコメントとか入れたければ
    filePattern: "*.md",
    sortBy: "name"
  },
  {
    output: ".cursor/rules/001_bestPractices_common.mdc",
    sourceDir: "rules/common",
    header: "", // もしコメントとか入れたければ
    filePattern: "*.md",
    sortBy: "name"
  }
];

// mdファイルを検索して結合する関数
async function buildMdcFile(config: typeof mdcConfigurations[0]) {
  // ルートディレクトリの取得（スクリプトの実行場所から相対パスで計算）
  const rootDir = path.resolve(process.cwd());
  
  // mdファイルのパターンを作成
  const pattern = path.join(rootDir, config.sourceDir, config.filePattern);
  
  // mdファイルを検索
  const files = await glob(pattern);
  
  // ファイル名でソート
  files.sort((a: string, b: string) => {
    const numA = extractNumberPrefix(path.basename(a));
    const numB = extractNumberPrefix(path.basename(b));
    return numA - numB;
  });
  
  // コンテンツの初期化
  let content = '';
  
  // ヘッダー情報を追加
  content += config.header;
  
  // 各mdファイルの内容を結合
  for (const file of files) {
    // console.log(`Processing file: ${file}`);
    const fileContent = await fs.promises.readFile(file, 'utf8');
    content += fileContent + '\n\n';
  }
  
  // mdcファイルを出力
  const outputPath = path.join(rootDir, config.output);
  
  // 出力ディレクトリが存在することを確認
  const outputDir = path.dirname(outputPath);
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });
  } catch (error) {
    // ディレクトリが既に存在する場合は無視
  }
  
  // ファイルに書き込み
  await fs.promises.writeFile(outputPath, content);
  
  console.log(`Generated ${config.output} from ${files.length} files in ${config.sourceDir}`);
}

// 既存のMDCファイルの中身を空にする関数
async function cleanMdcFiles() {
  const rootDir = path.resolve(process.cwd());
  
  // .cursor/rules ディレクトリの存在確認
  const rulesDir = path.join(rootDir, '.cursor/rules');
  try {
    await fs.promises.access(rulesDir);
  } catch (error) {
    // ディレクトリが存在しない場合は何もしない
    return;
  }
  
  // .mdc ファイルを検索して中身を空にする
  const mdcFiles = await glob(path.join(rulesDir, '*.mdc'));
  for (const file of mdcFiles) {
    console.log(`Clearing content of MDC file: ${file}`);
    await fs.promises.writeFile(file, ''); // ファイルの中身を空にする
  }
}

export async function generateMdcFiles() {
  // 既存のMDCファイルを削除
  await cleanMdcFiles();
  
  // 各設定に対してmdcファイルを生成
  for (const config of mdcConfigurations) {
    await buildMdcFile(config);
  }
}