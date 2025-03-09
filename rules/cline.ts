import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';
import { extractNumberPrefix } from './util';

async function cleanClineFile() {
  const rootDir = path.resolve(process.cwd());
  const clinerulesPath = path.join(rootDir, '.clinerules');
  await fs.promises.writeFile(clinerulesPath, '');
}

async function removeUnusedSections(content: string) {
  // 削除したいセクションを正規表現で特定
  const sectionRegex1 = /---\s*\ndescription: this file explains best practices[\s\S]*?---\s*\n/;
  const sectionRegex2 = /---\s*\ndescription: this is the rule we have to follow under any circumstance[\s\S]*?---\s*\n/;
  // セクションを削除して新しい内容を作成
  const newContent = content.replace(sectionRegex1, '').replace(sectionRegex2, '');
  return newContent;
}

// MDCファイルを読み込んで.clinerulesファイルを生成する
export async function generateClineFile() {
  await cleanClineFile();

  const rootDir = path.resolve(process.cwd());
  const clinerulesPath = path.join(rootDir, '.clinerules');
  const srcDir = path.join(rootDir, '.cursor/rules');
  const mdcFiles = await glob(path.join(srcDir, '*.mdc'));
  const sortedMdcFiles = mdcFiles.sort((a, b) => {
    const numA = extractNumberPrefix(path.basename(a));
    const numB = extractNumberPrefix(path.basename(b));
    return numA - numB;
  });
  try {
    const contents = []
    for (const mdcFile of sortedMdcFiles) {
      const content = await fs.promises.readFile(mdcFile, 'utf8');
      const existingContent = await fs.promises.readFile(clinerulesPath, 'utf8').catch(() => '');
      const newContent = existingContent + `\n${content}`;
      contents.push(newContent);
    }

    const newContent = contents.join('---\n');
    const cleanedContent = await removeUnusedSections(newContent);
    await fs.promises.writeFile(clinerulesPath, cleanedContent);

    console.log(`Updated .clinerules with content from ${srcDir}`);
  } catch (error) {
    console.error(`Error generating .clinerules for ${srcDir}:`, error);
  }
}