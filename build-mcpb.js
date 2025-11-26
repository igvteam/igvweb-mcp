import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('igvweb.mcpb');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Archive created: igvweb.mcpb (${archive.pointer()} total bytes)`);
});

archive.on('error', err => { throw err; });

archive.pipe(output);
archive.file('manifest.json', { name: 'manifest.json' });
archive.directory('dist/', 'dist');
archive.finalize();

