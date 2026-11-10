# Quality Assurance & Test Plan

This document records the testing suite, executed validations, and verification results.

## 1. Automated Logic Unit Tests (`node:test`)

File: `src/tests/restaurant.test.ts`
Execution: `npx --yes tsx --test src/tests/restaurant.test.ts`

| Test Case | Description | Result |
|---|---|---|
| `calculateItemUnitPrice` | Precision addition of base price, portion variant delta, and add-on extras in minor cents. | PASS |
| `calculateCartSubtotal` | Subtotal calculation across multiple lines and quantities. | PASS |
| `calculateDeliveryFee` | Standard delivery fee vs. free delivery threshold vs. zero fee for pickup/dine-in. | PASS |
| `validateAndApplyDiscount` | Percentage coupons (`ATELIER15`) and fixed discounts (`BISTRO10`), minimum order threshold enforcement. | PASS |
| `calculateOrderTotal` | Total calculation preventing negative results when discount exceeds order. | PASS |
| `generateOrderNumber` | Format validation: matching regex `^AB-\d{4}-\d{4}$`. | PASS |
| `isWithinOperatingHours` | Validation of operating hours, closed days (Sundays / late night buffer). | PASS |

## 2. Interactive User Journeys Tested

1. **Guest Browsing & Cart Journey**:
   - Navigation from Home &rarr; Menu &rarr; Filter Vegetarian &rarr; View Dish Modal &rarr; Add Extras &rarr; Cart Drawer recalculates live &rarr; Proceed to Checkout &rarr; Order Placed &rarr; Live Timeline Tracking.
2. **Table Reservation Journey**:
   - Select date, time slot, party size (2-20), seating area &rarr; Fill contact info &rarr; Immediate voucher code generated (#RES-XXXX).
3. **Table QR Code Ordering**:
   - URL parameter `?table=5` auto-detects table number and locks fulfillment to Dine-In table service.
4. **Administrator Operations**:
   - Access `/admin` &rarr; Authenticate &rarr; Update dish availability & price &rarr; Real-time status update in KDS &rarr; Confirm reservations &rarr; Export CSV reports.

## 3. Responsive & Device Compatibility

- 360px & 390px (Mobile smartphones): Sticky bottom bar, thumb-accessible controls, no horizontal overflow.
- 768px (Tablets): Two-column grids, modal scrolling.
- 1440px+ (Desktops): Editorial hero, widescreen multi-column layouts.
