const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  { name: "Precision Sensors", prefix: "SEN" },
  { name: "Robotic Actuators", prefix: "ACT" },
  { name: "Logic Controllers", prefix: "LOG" },
  { name: "Thermal Management", prefix: "THM" },
  { name: "Structural Composites", prefix: "STR" },
  { name: "Power Systems", prefix: "PWR" },
];

const adjectives = ["Quantum", "Neural", "Cryo", "Plasma", "Kinetic", "Aero", "Hyper", "Optic", "Nano", "Flux"];
const nouns = ["Core", "Module", "Array", "Nexus", "Link", "Cell", "Grid", "Matrix", "Unit", "Node"];

const geekCompanyNames = [
  "Cyberdyne Systems", "Stark Industries", "Weyland-Yutani Corp", "Aperture Science", "Tyrell Corporation",
  "OCP (Omni Consumer Products)", "Wayne Enterprises", "LexCorp", "Oscorp Industries", "Umbrella Corporation",
  "Massive Dynamic", "Hooli", "Pied Piper", "E Corp (Evil Corp)", "Globex Corporation", "Initech",
  "Encom", "Tetravaal", "Wallace Corporation", "Lunar Industries", "Blue Sun Corp", "Soylent Corp",
  "Versalife", "Sarif Industries", "Abstergo Industries", "Black Mesa Research", "Shinra Electric Power",
  "Fontaine Futuristics", "Ryan Industries", "Hyperion Corp", "Maliwan", "Torgue", "Vladof",
  "UAC (Union Aerospace)", "Vault-Tec", "RobCo Industries", "General Atomics", "Cerberus", "Systems Alliance",
  "Arasaka Corp", "Militech", "Kang Tao", "Petrochem", "SovOil", "Biotechnica", "Kendachi",
  "Zura-Bio", "Trauma Team International", "Night City PD", "Nakatomi Plaza Group", "Ishimura Mining",
  "Vandelay Industries", "Kramerica Industries", "Dunder Mifflin", "Prestige Worldwide", "Entertainment 720"
];

function generateSKUs(count: number) {
  const skus = [];
  const codes = new Set();
  while (skus.length < count) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const serial = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const code = `${category.prefix}-${serial}`;
    if (codes.has(code)) continue;
    codes.add(code);
    const name = `${adj} ${noun} ${Math.floor(Math.random() * 900) + 100}`;
    const costPrice = parseFloat((Math.random() * 500 + 50).toFixed(2));
    const sellPrice = parseFloat((costPrice * (1.5 + Math.random() * 2)).toFixed(2));
    const rand = Math.random();
    let quantity;
    if (rand < 0.1) quantity = 0;
    else if (rand < 0.3) quantity = Math.floor(Math.random() * 14) + 1;
    else quantity = Math.floor(Math.random() * 100) + 15;
    skus.push({ name, code, description: `High-performance ${category.name.toLowerCase()} component.`, costPrice, sellPrice, quantity });
  }
  return skus;
}

function generateClients(count: number) {
  const clients = [];
  const emails = new Set();
  for (let i = 0; i < count; i++) {
    const baseName = geekCompanyNames[i % geekCompanyNames.length];
    const suffix = i >= geekCompanyNames.length ? ` Division ${Math.floor(i / geekCompanyNames.length)}` : "";
    const name = `${baseName}${suffix}`;
    
    const domain = baseName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".io";
    let email = `procurement@${domain}`;
    if (emails.has(email)) email = `orders.${i}@${domain}`;
    emails.add(email);

    clients.push({
      name,
      email,
      phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      address: `${Math.floor(Math.random() * 999) + 1} Industrial Way, Sector ${Math.floor(Math.random() * 9) + 1}`
    });
  }
  return clients;
}

async function main() {
  console.log("Ultra-Cleaning database for Geek-Enterprise seeding...");
  await prisma.auditLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.sKU.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  console.log("Initializing System User...");
  const user = await prisma.user.create({
    data: { 
      id: "system", 
      name: "System Admin", 
      email: "admin@nexis.hq", 
      role: "ADMIN",
      password: "adminpassword123",
      permissions: ["overview", "inventory", "orders", "clients", "revenue", "audit", "settings", "users"]
    }
  });

  console.log("Generating 220+ Corporate Entities...");
  const clientData = generateClients(225);
  const clients = [];
  for (const c of clientData) {
    const created = await prisma.client.create({ data: c });
    clients.push(created);
  }

  console.log("Generating 215 SKU entities...");
  const skuData = generateSKUs(215);
  const skus = [];
  for (const s of skuData) {
    const created = await prisma.sKU.create({ data: s });
    skus.push(created);
  }

  console.log("Generating 150 enterprise orders with cross-entity LTV...");
  for (let i = 0; i < 150; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const itemCount = Math.floor(Math.random() * 4) + 1; 
    
    let totalSales = 0;
    let totalCost = 0;
    const orderItems = [];

    for (let j = 0; j < itemCount; j++) {
      const sku = skus[Math.floor(Math.random() * skus.length)];
      const qty = Math.floor(Math.random() * 10) + 1;
      const price = Number(sku.sellPrice);
      const cost = Number(sku.costPrice);
      totalSales += price * qty;
      totalCost += cost * qty;
      orderItems.push({ skuId: sku.id, quantity: qty, unitPrice: price, unitCost: cost });
    }

    await prisma.order.create({
      data: {
        userId: user.id,
        clientId: client.id,
        customerName: client.name,
        customerEmail: client.email,
        customerPhone: client.phone,
        totalSales,
        totalCost,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        items: { create: orderItems }
      }
    });
  }

  console.log("Database successfully seeded with 225 Clients and 150 Orders.");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
