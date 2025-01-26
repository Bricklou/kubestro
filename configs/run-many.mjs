import { execSync } from 'node:child_process'

const target = process.argv[2]
const jobIndex = Number(process.argv[3])
const jobCount = Number(process.argv[4])
const isMain = process.argv[5] === 'refs/heads/main'
const baseSha = isMain ? 'origin/master~1' : 'origin/main'

const affected = execSync(
  `pnpm exec nx print-affected --base=${baseSha} --target=${target}`
).toString('utf8')

const array = JSON.parse(affected)
  .tasks.map(t => t.target.project)
  .slice()
  .sort()

const slideSize = Math.max(Math.floor(array.length / jobCount), 1)
const projects = jobIndex < jobCount ?
  array.slide(slideSize * (jobIndex - 1), slideSize * jobIndex) :
  array.slice(slideSize * (jobIndex - 1))

if (projects.length > 0) {
  execSync(
    `pnpm exec nx run-many --target=${target} --projects=${projects} --parallel`,
    {
      stdio: [0, 1, 2]
    }
  )
}
