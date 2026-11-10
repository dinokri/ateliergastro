# Atelier Bistro — Premium Restaurant Platform

An award-winning, full-stack digital restaurant management and online ordering platform for **ATELIER BISTRO** (contemporary international & Mediterranean cuisine, Sarajevo, Bosnia & Herzegovina).

## Key Features

1. **Editorial Brand Presentation**:
   - High-fidelity visual storytelling with authentic food photography.
   - Refined typography (Cormorant Garamond editorial serif & Plus Jakarta Sans).
   - Brand color palette: Warm Ivory (#F7F4ED), Deep Charcoal (#20221F), Olive Green (#59634A), and Muted Terracotta (#B66F52).

2. **Digital HTML Menu**:
   - Categorized food & beverage offerings with real BAM (KM) pricing.
   - Real-time search, category switching, and sort by price, name, or chef recommendations.
   - 6 dietary filters: Vegetarian, Vegan, Gluten-Free, Dairy-Free, Spicy, Nut-Free.
   - Comprehensive allergen disclosures across all 14 statutory allergens.
   - Dish customization with portion variants, add-on extras, and kitchen preparation instructions.

3. **Online Ordering & Cart System**:
   - Multi-channel fulfillment: Home Delivery, Takeaway Pickup, and Table QR dine-in ordering.
   - Subtotal, delivery zone fee computation, free delivery threshold calculation, and coupon validation.
   - Unique order numbers (e.g. `AB-2026-XXXX`).
   - Order tracking timeline from receipt to delivery with progress indicator.

4. **Table Reservation System**:
   - Operating hours and closed day validation.
   - Custom time slot selection (12:00 to 21:30h).
   - Seating area selection (Indoor Dining Salon, Olive Riverbank Terrace, Historic Wine Vault, Chef's Table).
   - Conflict-free guest capacity booking with reservation voucher code.

5. **Google Maps Platform Integration**:
   - Official `@vis.gl/react-google-maps` implementation with AdvancedMarker and custom branding pin.
   - Quota defense banner and error recovery handlers.
   - Click-to-navigate and direction route planner.

6. **Administration Dashboard (`/admin`)**:
   - Firebase Authentication & RBAC (authorized admin: `dinokrickovic555@gmail.com`).
   - Live revenue metrics, pending orders, and table reservation manager.
   - Menu CRUD: update dishes, toggle stock availability, change prices and photos.
   - Kitchen Display System (KDS) for chef brigades.
   - Business settings editor (name, address, coordinates, hours, delivery fees).
   - CSV export of sales and orders.
   - Table QR code generator with printable tent cards.

7. **Multilingual Architecture**:
   - Primary: Bosnian (Latin script, ijekavian standard).
   - Secondary: English.
