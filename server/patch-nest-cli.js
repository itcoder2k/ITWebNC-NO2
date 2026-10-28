import fs from 'node:fs';
import path from 'node:path';

const nestCliPath = path.resolve('node_modules', '@nestjs', 'cli', 'bin', 'nest.js');
if (fs.existsSync(nestCliPath)) {
  let content = fs.readFileSync(nestCliPath, 'utf8');
  if (!content.includes("import 'ora';")) {
    content = content.replace("import { Command }", "import 'ora';\nimport { Command }");
    fs.writeFileSync(nestCliPath, content, 'utf8');
  }
}
