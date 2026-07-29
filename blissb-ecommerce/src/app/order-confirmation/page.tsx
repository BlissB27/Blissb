import { redirect } from "next/navigation";

// Retired: delivery method + contact + payment are now one page. Old links/bookmarks land here.
export default function OrderConfirmationRedirect() {
  redirect("/checkout");
}
