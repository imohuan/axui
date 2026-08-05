import { cpSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'dist-types'
const DST = 'dist'

if (!existsSync(SRC)) {
  console.error(`Source directory "${SRC}" not found`)
  process.exit(1)
}

cpSync(SRC, DST, { recursive: true })

const mainIndexPath = join(DST, 'components', 'ui', 'index.d.ts')
if (existsSync(mainIndexPath)) {
  const relativePath = 'components/ui/index'
  const barrel = `export * from './${relativePath}'\n`
  writeFileSync(join(DST, 'index.d.ts'), barrel)
  console.log(`Created dist/index.d.ts re-exporting ./${relativePath}`)
} else {
  console.error('Could not find components/ui/index.d.ts')
  process.exit(1)
}

console.log('Types copied successfully.')
