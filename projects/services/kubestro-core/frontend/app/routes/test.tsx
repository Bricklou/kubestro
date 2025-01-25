import { linkVariants } from "@kubestro/design-system";
import { Link } from "react-router";

export default function Test() {
  return (
    <div className="p-8">
      <p>This is a test page</p>
      <Link className={linkVariants()} to="/">Go back to /home</Link>
    </div>
  )
}
