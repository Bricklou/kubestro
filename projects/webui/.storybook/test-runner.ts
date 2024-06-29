import { TestRunnerConfig } from '@storybook/test-runner'
import { waitForPageReady } from '@storybook/test-runner'

const config: TestRunnerConfig = {
  /* Hook to execute after a story is visited and fully rendered.
   * The page argument is the Playwright's page object for the story
   * The context argument is a Storybook object containing the story's id, title, and name.
   */
  async postVisit(page) {
    // This utility function is designed for image snapshot testing. It will wait for the page to be fully loaded, including all the async items (e.g., images, fonts, etc.).
    await waitForPageReady(page)
  },
}

export default config
