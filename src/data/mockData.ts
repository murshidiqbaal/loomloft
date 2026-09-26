export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  category: "Handloom" | "Men" | "Women" | "Ethnic Wear" | "Casual" | "Festive";
  collection: string;
  fabric: string;
  origin: string;
  weaveTechnique: string;
  description: string;
  story: {
    thread: string;
    craft: string;
    originCluster: string;
    artisanNote: string;
    careInstructions: string[];
  };
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  badge?: string;
  tags: string[];
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  avatar?: string;
}

export interface CollectionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
  tag: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  total: number;
  paymentMethod: "UPI" | "Credit/Debit Card" | "Net Banking" | "Cash on Delivery";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: {
    productName: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-saree-1",
    name: "Banarasi Katan Pure Silk Saree with Kadwa Floral Zari",
    slug: "banarasi-katan-pure-silk-saree-kadwa-floral-zari",
    sku: "LL-SR-01",
    price: 21990,
    originalPrice: 27990,
    discount: "21% OFF",
    category: "Ethnic Wear",
    collection: "Heritage Series",
    fabric: "100% Pure Katan Mulberry Silk with 24k Gold Zari",
    origin: "Varanasi, Uttar Pradesh",
    weaveTechnique: "Master Kadwa Handloom Technique (No Float Backing)",
    description: "An imperial Banarasi drape woven from pure degummed mulberry silk with exquisite Kadwa floral butis hand-engraved with fine gold zari. Accompanied by an unstitched contrast silk blouse piece.",
    story: {
      thread: "Triple-twisted 20/22 denier Katan silk warp with real gold-coated silver electroplated zari thread.",
      craft: "Each floral motif is separately locked into the warp without floating threads on the reverse.",
      originCluster: "Madanpura & Chowk Handloom Guilds, Varanasi",
      artisanNote: "Handcrafted by 4th generation master weaver Ansari and his team over 140 uninterrupted loom hours.",
      careInstructions: [
        "Dry clean only by heritage saree conservators",
        "Wrap in breathable organic mulmul muslin",
        "Air in gentle morning shade every 3 months"
      ]
    },
    colors: [
      { name: "Forest Emerald", hex: "#06291A" },
      { name: "Royal Gold", hex: "#D4AF37" },
      { name: "Ruby Crimson", hex: "#73151E" }
    ],
    sizes: ["Free Size (6.3m with Blouse)"],
    stock: 9,
    rating: 5.0,
    reviewCount: 46,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    badge: "Masterpiece Saree",
    tags: ["Saree", "Banarasi", "Pure Silk", "Kadwa", "Gold Zari"]
  },
  {
    id: "prod-nighty-1",
    name: "Mulberry Pure Silk Slumber Nighty & Loungewear Slip",
    slug: "mulberry-pure-silk-slumber-nighty-loungewear-slip",
    sku: "LL-NT-01",
    price: 6490,
    originalPrice: 8490,
    discount: "23% OFF",
    category: "Women",
    collection: "Ethereal Weaves",
    fabric: "22 Momme Grade-6A Mulberry Silk",
    origin: "Mysore Silk Clusters, Karnataka",
    weaveTechnique: "Low-tension Charmeuse Silk Loom Weave",
    description: "An exquisite silk nighty and lounge slip tailored from 22 Momme Grade-6A Mulberry silk. Featuring a fluid cowl neck, adjustable gold-tipped bias straps, and French seam construction for effortless overnight comfort.",
    story: {
      thread: "Reeled from organically fed Mysore silkworm cocoons, offering hypoallergenic natural amino acids.",
      craft: "Cut on the true bias to cascade smoothly across natural curves without cling or friction.",
      originCluster: "Mysore Artisan Silk Guild",
      artisanNote: "Treated with herbal natural softening enzyme bath without chemical finishing agents.",
      careInstructions: [
        "Delicate cold hand wash with pH-neutral silk detergent",
        "Do not wring; wrap in terry towel to extract moisture",
        "Cool iron on reverse side while slightly damp"
      ]
    },
    colors: [
      { name: "Forest Jade", hex: "#0c3b25" },
      { name: "Champagne Gold", hex: "#E8D3A2" },
      { name: "Midnight Onyx", hex: "#161917" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 16,
    rating: 4.9,
    reviewCount: 39,
    images: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    badge: "Luxury Sleepwear",
    tags: ["Nighty", "Silk Nightwear", "Mulberry", "Sleepwear", "Loungewear"]
  },
  {
    id: "prod-1",
    name: "Chanderi Silk Kurta Set in Forest Emerald",
    slug: "chanderi-silk-kurta-set-forest-emerald",
    sku: "LL-CH-01",
    price: 8490,
    originalPrice: 10990,
    discount: "22% OFF",
    category: "Festive",
    collection: "Heritage Series",
    fabric: "Pure Chanderi Silk & Zari",
    origin: "Chanderi, Madhya Pradesh",
    weaveTechnique: "Hand-thrown Shuttle Loom with Eknalya Weave",
    description: "An ode to sovereign royalty, woven from gossamer-weight Chanderi silk with hand-beaten gold zari booties. Paired with tailored handloom silk trousers and a scalloped organza dupatta.",
    story: {
      thread: "Fine 300-count degummed mulberry silk spun with silver core electroplated in 24k gold zari.",
      craft: "The master weavers interlock the floral butis by hand using bamboo needles on traditional pit looms.",
      originCluster: "Chanderi Weaver Guild, Pranpur Heritage Village",
      artisanNote: "Handcrafted by Master Weaver Rameshwar and his family over 48 intensive weaving hours.",
      careInstructions: [
        "Dry clean only by organic textile specialists",
        "Store in breathable unbleached muslin wrap",
        "Steam press on reverse side only"
      ]
    },
    colors: [
      { name: "Forest Emerald", hex: "#083723" },
      { name: "Mustard Gold", hex: "#D6971A" },
      { name: "Raw Ivory", hex: "#F3EFE6" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 14,
    rating: 4.9,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    badge: "Masterpiece",
    tags: ["Chanderi", "Pure Silk", "Festive", "Hand-Zari"]
  },
  {
    id: "prod-2",
    name: "Handspun Khadi Raw Silk Nehru Bandhgala",
    slug: "handspun-khadi-raw-silk-nehru-bandhgala",
    sku: "LL-MN-02",
    price: 6990,
    originalPrice: 8490,
    discount: "18% OFF",
    category: "Men",
    collection: "Crafted Elegance",
    fabric: "Handspun Desi Tussar & Khadi Cotton",
    origin: "Bhagalpur, Bihar",
    weaveTechnique: "Textured Amber Charkha Handloom Weave",
    description: "Tailored Nehru jacket featuring uneven slub textures of hand-spun raw silk, horn buttons, and contrast mustard thread topstitching inspired by heirloom tailoring.",
    story: {
      thread: "Unbleached wild Tussar cocoons reeled by hand into high-tensile organic thread.",
      craft: "Woven on wooden fly-shuttle frame looms with natural slub variations celebrating human touch.",
      originCluster: "Bhagalpur Weaver Cooperative",
      artisanNote: "Every jacket exhibits unique slub irregularities that authenticate hand-spinning.",
      careInstructions: [
        "Specialist dry clean only",
        "Air in shaded natural breeze after wearing",
        "Use wooden hangers to maintain shoulder drape"
      ]
    },
    colors: [
      { name: "Deep Olive Forest", hex: "#163426" },
      { name: "Earthy Taupe", hex: "#7E6E59" },
      { name: "Warm Charcoal", hex: "#2B2D2B" }
    ],
    sizes: ["38", "40", "42", "44", "46"],
    stock: 19,
    rating: 4.8,
    reviewCount: 24,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    badge: "Artisan Tailored",
    tags: ["Men", "Bandhgala", "Tussar Silk", "Khadi"]
  },
  {
    id: "prod-3",
    name: "Kanjivaram Mulberry Silk Saree with Temple Zari Border",
    slug: "kanjivaram-mulberry-silk-saree-temple-zari",
    sku: "LL-KJ-03",
    price: 19490,
    originalPrice: 24990,
    discount: "22% OFF",
    category: "Ethnic Wear",
    collection: "Heritage Series",
    fabric: "100% Pure Mulberry Silk & 3-Ply Gold Thread",
    origin: "Kanchipuram, Tamil Nadu",
    weaveTechnique: "Korvai Interlocking Weft Technique",
    description: "An heirloom Kanjivaram woven with the legendary Korvai technique where body and temple border are woven separately and locked together with structural perfection.",
    story: {
      thread: "Heavy triple-warp mulberry silk soaked in rice water starch for unmatched lustre.",
      craft: "Two weavers sit shoulder-to-shoulder synchronising shuttles for the Korvai interlocking joints.",
      originCluster: "Kanchipuram Handloom Weavers Society",
      artisanNote: "Requires two master artisans working in absolute unison for 12 days straight.",
      careInstructions: [
        "Dry clean only with trusted heritage saree conservators",
        "Refold every three months to prevent crease fatigue",
        "Store with dried neem leaves in a pure cotton bag"
      ]
    },
    colors: [
      { name: "Royal Forest Green", hex: "#06291A" },
      { name: "Crimson Maroon", hex: "#73151E" },
      { name: "Mustard Gold", hex: "#E2A418" }
    ],
    sizes: ["Free Size (5.5m + Blouse)"],
    stock: 7,
    rating: 5.0,
    reviewCount: 52,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    badge: "Heritage Treasure",
    tags: ["Kanjivaram", "Silk Mark", "Handloom Certified", "Korvai"]
  },
  {
    id: "prod-4",
    name: "Jamdani Hand-Woven Muslin Overlay Tunic",
    slug: "jamdani-hand-woven-muslin-overlay-tunic",
    sku: "LL-JM-04",
    price: 5890,
    originalPrice: 6990,
    discount: "15% OFF",
    category: "Women",
    collection: "Ethereal Weaves",
    fabric: "Featherweight Organic Muslin Cotton",
    origin: "Nabadwip, West Bengal",
    weaveTechnique: "Discontinuous Weft Supplementary Thread Technique",
    description: "Semi-sheer gossamer cotton tunic with floating floral motifs hand-inserted between transparent weft lines using horn needles. A contemporary silhouette rooted in UNESCO heritage.",
    story: {
      thread: "120s count combed organic Bengal cotton spun in early morning humidity.",
      craft: "Motifs are woven freehand directly from the weaver's mind without carbon prints.",
      originCluster: "Kalna Handloom Guild",
      artisanNote: "Jamdani is poetry on muslin — every leaf is manually counted and locked.",
      careInstructions: [
        "Gentle cold handwash using mild natural soap nuts",
        "Do not wring; lay flat to dry in shade",
        "Warm iron while slightly damp"
      ]
    },
    colors: [
      { name: "Ivory Cloud", hex: "#FAF6EE" },
      { name: "Pale Mint", hex: "#C5D8C7" },
      { name: "Muted Terracotta", hex: "#B85C4B" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 22,
    rating: 4.7,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    badge: "UNESCO Heritage",
    tags: ["Jamdani", "Muslin", "Contemporary", "Summer"]
  },
  {
    id: "prod-5",
    name: "Pure Belgian Linen Band-Collar Kurta Shirt",
    slug: "pure-belgian-linen-band-collar-kurta-shirt",
    sku: "LL-LN-05",
    price: 4290,
    originalPrice: 4990,
    discount: "14% OFF",
    category: "Casual",
    collection: "Crafted Elegance",
    fabric: "100% Organic European Flax Hand-Woven Linen",
    origin: "Kochi, Kerala",
    weaveTechnique: "Aerated Plain Weave with Selvage Edge Detail",
    description: "Minimalist everyday luxury. Cut from 60 Lea organic flax linen, washed with enzyme wash for broken-in softness, mother-of-pearl buttons, and tailored comfort fit.",
    story: {
      thread: "Long-staple flax fibers spun into breathable yarns that soften with every single wash.",
      craft: "Woven on calibrated handlooms to allow micro-air pockets for maximum tropical breathability.",
      originCluster: "Malabar Craft Guild",
      artisanNote: "Linen retains memory and drapes naturally without artificial stiffeners.",
      careInstructions: [
        "Machine wash gentle cycle cold",
        "Hang dry immediately in the shade",
        "Embrace natural crinkles or iron while damp"
      ]
    },
    colors: [
      { name: "Mustard Gold", hex: "#D6971A" },
      { name: "Natural Ecru", hex: "#ECE6D8" },
      { name: "Forest Moss", hex: "#224A35" }
    ],
    sizes: ["38", "40", "42", "44", "46"],
    stock: 31,
    rating: 4.8,
    reviewCount: 41,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    badge: "Essential Luxury",
    tags: ["Linen", "Men", "Casual", "Organic"]
  },
  {
    id: "prod-6",
    name: "Handblock Ajrakh Modal Silk Saree with Indigo Resham",
    slug: "handblock-ajrakh-modal-silk-saree-indigo-resham",
    sku: "LL-AJ-06",
    price: 9890,
    originalPrice: 12490,
    discount: "20% OFF",
    category: "Handloom",
    collection: "Artisan Earth",
    fabric: "Semi-Tussar Modal Silk",
    origin: "Ajrakhpur, Kutch, Gujarat",
    weaveTechnique: "16-Stage Natural Dye Handblock Printing on Handloom Silk",
    description: "An ancient geometry of star and cloud motifs pressed by hand using carved teak wood blocks. Dyed with pure fermented indigo, madder root, and pomegranate rind.",
    story: {
      thread: "Lustrous modal silk blend that offers fluid liquid drape with handloom tactile depth.",
      craft: "Washed in the desert rivers of Kutch across 16 stages of sun-curing and hand stamping.",
      originCluster: "Khatri Family Guild, Dhamadka",
      artisanNote: "Colored exclusively with forest roots, jaggery, indigo paste, and river water.",
      careInstructions: [
        "First 3 washes dry clean recommended",
        "Wash separately in cold water with mild liquid detergent",
        "Keep away from direct harsh sunlight"
      ]
    },
    colors: [
      { name: "Deep Indigo & Forest", hex: "#112432" },
      { name: "Madder Rust", hex: "#7B2E24" },
      { name: "Mustard Ochre", hex: "#C78D20" }
    ],
    sizes: ["Free Size (6.2m with Blouse)"],
    stock: 11,
    rating: 4.9,
    reviewCount: 35,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    badge: "100% Natural Dye",
    tags: ["Ajrakh", "Kutch", "Handblock", "Natural Dyes"]
  },
  {
    id: "prod-7",
    name: "Ikat Hand-Woven Silk Blend Wrap Dress",
    slug: "ikat-hand-woven-silk-blend-wrap-dress",
    sku: "LL-IK-07",
    price: 6490,
    originalPrice: 7990,
    discount: "18% OFF",
    category: "Women",
    collection: "Ethereal Weaves",
    fabric: "Pochampally Mulberry Silk & Mercerised Cotton",
    origin: "Bhoodan Pochampally, Telangana",
    weaveTechnique: "Double Ikat Resist Dye Handloom Weave",
    description: "Sophisticated wrap dress fusing mathematical precision of double ikat tie-dye with modern wrap silhouette. Features contrast hand-stitched piping and side belt.",
    story: {
      thread: "Warp and weft yarns are tied with rubber bands and dyed in multiple stages before weaving.",
      craft: "The weaver aligns microscopically dyed dots to create sharp blurred geometric motifs.",
      originCluster: "Telangana Handloom Weavers Cooperative",
      artisanNote: "Any minor blur in pattern is the proud signature of authentic human hand alignment.",
      careInstructions: [
        "Dry clean or cold handwash with mild shampoo",
        "Dry flat inside out in shade",
        "Iron on medium silk setting"
      ]
    },
    colors: [
      { name: "Forest Onyx", hex: "#0E2419" },
      { name: "Saffron Marigold", hex: "#D48B1C" },
      { name: "Porcelain Cream", hex: "#F3EDE1" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 16,
    rating: 4.8,
    reviewCount: 29,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    badge: "Double Ikat",
    tags: ["Pochampally", "Ikat", "Modern Dress", "Silk Blend"]
  },
  {
    id: "prod-8",
    name: "Pure Pashmina Hand-Embroidered Sozni Stole",
    slug: "pure-pashmina-hand-embroidered-sozni-stole",
    sku: "LL-PS-08",
    price: 14990,
    originalPrice: 18990,
    discount: "21% OFF",
    category: "Handloom",
    collection: "Heritage Series",
    fabric: "100% Grade-A Changthangi Cashmere Wool",
    origin: "Srinagar, Kashmir",
    weaveTechnique: "Wooden Spindle Hand-spun Pashmina with Fine Needle Sozni",
    description: "Spun from the underbelly fleece of high-altitude Himalayan mountain goats. Finished with intricate Sozni needle embroidery along the borders resembling celestial paisleys.",
    story: {
      thread: "12-micron Changthangi cashmere fleece, hand-carded and spun on wooden Yender spindles.",
      craft: "Master craftswoman uses single-strand silk thread to embroider motifs invisible from reverse.",
      originCluster: "Old City Artisan Guild, Srinagar",
      artisanNote: "Each stole takes over 180 hours of single-needle hand embroidering.",
      careInstructions: [
        "Professional cashmere dry clean only",
        "Store flat in the provided cedar-lined box",
        "Never hang on thin metal wire hangers"
      ]
    },
    colors: [
      { name: "Antique Ivory", hex: "#F3ECE0" },
      { name: "Forest Pine", hex: "#0E3022" },
      { name: "Smoky Charcoal", hex: "#343634" }
    ],
    sizes: ["200cm x 75cm"],
    stock: 6,
    rating: 5.0,
    reviewCount: 47,
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"
    ],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    badge: "GI Tag Certified",
    tags: ["Pashmina", "Cashmere", "Kashmir", "Heirloom"]
  }
];

export const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: "col-1",
    slug: "heritage-series",
    title: "The Heritage Series",
    subtitle: "Sacred silks & royal court weaves",
    description: "Centuries of royal Indian weaving traditions preserved in Kanjivaram silks, Banarasi brocades, and Chanderi gossamers.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    itemCount: 24,
    featured: true,
    tag: "Royal Loom"
  },
  {
    id: "col-2",
    slug: "artisan-earth",
    title: "Artisan Earth & Indigo",
    subtitle: "Plant dyed organic handlooms",
    description: "Colored by wild madder roots, fermented indigo, and marigolds. Zero synthetic chemistry, 100% biodegradable luxury.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
    itemCount: 18,
    featured: true,
    tag: "100% Botanical"
  },
  {
    id: "col-3",
    slug: "ethereal-weaves",
    title: "Ethereal Weaves",
    subtitle: "Jamdani muslins & sheer silks",
    description: "Featherlight handlooms designed for modern fluidity, tropical ease, and timeless grace.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
    itemCount: 16,
    featured: false,
    tag: "Airy Luxury"
  },
  {
    id: "col-4",
    slug: "crafted-elegance",
    title: "Crafted Elegance (Men)",
    subtitle: "Tailored bandhgalas & linen kurtas",
    description: "Precision bespoke tailoring meeting the organic slub texture of wild handspun tussar and European flax.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
    itemCount: 15,
    featured: false,
    tag: "Tailored Craft"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Ananya Deshmukh",
    location: "Mumbai",
    rating: 5,
    date: "12 September 2026",
    productName: "Chanderi Silk Kurta Set in Forest Emerald",
    comment: "The feel of the Chanderi silk is unlike anything from commercial retail. You can feel the heartbeat of the loom in the weave. The gold zari detailing catches the candlelight beautifully.",
    verifiedBuyer: true
  },
  {
    id: "rev-2",
    author: "Vikramaditya Rao",
    location: "Bengaluru",
    rating: 5,
    date: "18 September 2026",
    productName: "Handspun Khadi Raw Silk Nehru Bandhgala",
    comment: "Sublime tailoring. The raw tussar silk texture has an earthy yet ultra-sophisticated weight. Received endless compliments at my brother's wedding.",
    verifiedBuyer: true
  },
  {
    id: "rev-3",
    author: "Gayatri Krishnan",
    location: "Chennai",
    rating: 5,
    date: "04 September 2026",
    productName: "Kanjivaram Mulberry Silk Saree",
    comment: "My mother is an ardent handloom collector and she was in awe of the Korvai interlocking joint on this Kanjivaram. A true heirloom that will pass down generations.",
    verifiedBuyer: true
  },
  {
    id: "rev-4",
    author: "Devika Sen",
    location: "Kolkata",
    rating: 5,
    date: "28 August 2026",
    productName: "Jamdani Hand-Woven Muslin Overlay Tunic",
    comment: "Light as morning fog. The freehand floral motifs woven into the muslin are breathtakingly subtle. This is how Indian handloom should be celebrated.",
    verifiedBuyer: true
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord-101",
    orderNumber: "LL-2026-8891",
    customerName: "Rohan Singhal",
    customerEmail: "rohan.singhal@example.com",
    customerPhone: "+91 98201 44512",
    date: "2026-09-23",
    total: 8490,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Processing",
    items: [
      {
        productName: "Chanderi Silk Kurta Set in Forest Emerald",
        size: "L",
        color: "Forest Emerald",
        quantity: 1,
        price: 8490,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80"
      }
    ],
    shippingAddress: {
      street: "Flat 402, Sterling Greens, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    }
  },
  {
    id: "ord-102",
    orderNumber: "LL-2026-8890",
    customerName: "Meera Somani",
    customerEmail: "meera.somani@example.com",
    customerPhone: "+91 98110 99823",
    date: "2026-09-22",
    total: 19490,
    paymentMethod: "Credit/Debit Card",
    paymentStatus: "Paid",
    status: "Shipped",
    items: [
      {
        productName: "Kanjivaram Mulberry Silk Saree with Temple Zari Border",
        size: "Free Size",
        color: "Royal Forest Green",
        quantity: 1,
        price: 19490,
        image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80"
      }
    ],
    shippingAddress: {
      street: "Plot 18, Road No. 12, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034"
    }
  },
  {
    id: "ord-103",
    orderNumber: "LL-2026-8889",
    customerName: "Aditya Verma",
    customerEmail: "aditya.v@example.com",
    customerPhone: "+91 97170 33201",
    date: "2026-09-20",
    total: 6990,
    paymentMethod: "Net Banking",
    paymentStatus: "Paid",
    status: "Delivered",
    items: [
      {
        productName: "Handspun Khadi Raw Silk Nehru Bandhgala",
        size: "42",
        color: "Deep Olive Forest",
        quantity: 1,
        price: 6990,
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"
      }
    ],
    shippingAddress: {
      street: "B-64, Gulmohar Park",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110049"
    }
  }
];

export const INITIAL_COUPONS = [
  {
    code: "FIRSTLOOM",
    discountPercent: 15,
    description: "Welcome to LoomLoft: 15% off on your first handcrafted order",
    minOrder: 4999,
    validUntil: "2026-12-31",
    active: true
  },
  {
    code: "THREAD10",
    discountPercent: 10,
    description: "10% privilege discount on all handloom sarees & suits",
    minOrder: 2999,
    validUntil: "2026-11-30",
    active: true
  },
  {
    code: "HERITAGE20",
    discountPercent: 20,
    description: "Exclusive festive heritage gift discount",
    minOrder: 14999,
    validUntil: "2026-10-31",
    active: true
  }
];

export const CMS_CONTENT = {
  hero: {
    headline: "WEAVING STORIES. THREAD BY THREAD.",
    subheadline: "Timeless handloom craftsmanship, reimagined for the modern wardrobe.",
    primaryCta: "EXPLORE COLLECTION",
    secondaryCta: "DISCOVER OUR STORY",
    scrollIndicator: "SCROLL TO DISCOVER"
  },
  announcement: "COMPLIMENTARY HERITAGE PACKAGING & DOMESTIC INSURED SHIPPING ON ALL ORDERS",
  brandStory: {
    title: "FROM THREAD TO TREND",
    tagline: "Quality in Every Thread",
    steps: [
      {
        phase: "01. The Thread",
        title: "Pure Native Fibers",
        desc: "We source exclusively hand-reeled wild Tussar, organic unbleached desi cotton, and 24k electroplated gold zari."
      },
      {
        phase: "02. The Craft",
        title: "Pit-Loom Heritage",
        desc: "No mechanical or electric engines touch our fabrics. Every centimetre is counted by the rhythm of artisan foot pedals."
      },
      {
        phase: "03. The People",
        title: "Artisan Guilds",
        desc: "Over 450 certified handloom families receive fair-wage compensation, healthcare, and legacy craft succession."
      },
      {
        phase: "04. The Fashion",
        title: "Contemporary Soul",
        desc: "Modern silhouettes designed for global living while respecting sacred heritage weaving geometry."
      }
    ]
  },
  social: {
    instagram: "https://www.instagram.com/loom_loft_/?hl=en",
    youtube: "https://www.youtube.com/@LoomLoft-Handloom",
    facebook: "https://www.facebook.com/Loomloft.net"
  }
};
