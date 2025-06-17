import { mkdir, writeFile, access } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import { constants } from "fs";

// Define ideal folder structure
const structure = {
  src: {
    assets: {},
    components: {},
    features: {
      dashboard: {
        "Dashboard.jsx": "",
        "dashboard.module.css": "",
        "dashboardService.js": "",
      },
      sales: {
        "Sales.jsx": "",
        "sales.module.css": "",
        "salesService.js": "",
      },
      invoice: {
        "Invoice.jsx": "",
        "invoice.module.css": "",
        "invoiceService.js": "",
      },
      purchase: {
        "Purchase.jsx": "",
        "purchase.module.css": "",
        "purchaseService.js": "",
      },
      customers: {
        "Customers.jsx": "",
        "customers.module.css": "",
        "customersService.js": "",
      },
    },
    hooks: {
      "useFetch.js": "",
    },
    layouts: {
      "MainLayout.jsx": "",
    },
    routes: {
      "routes.jsx": "",
    },
    services: {
      "tauriBridge.js": "",
      "api.js": "",
    },
    store: {
      "index.js": "",
    },
    styles: {
      "global.css": "",
      "theme.js": "",
    },
    utils: {
      "helpers.js": "",
      "validators.js": "",
    },
  },
  "src-tauri": {
    src: {
      "main.rs": "",
      "commands.rs": "",
      modules: {
        "sales.rs": "",
        "invoice.rs": "",
      },
    },
    "build.rs": "",
    "Cargo.toml": "",
  },
  ".env": "",
};

// Helper to check if file exists
async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Recursive function to create folders and files
async function createStructure(basePath, obj) {
  for (const name in obj) {
    const fullPath = join(basePath, name);
    if (typeof obj[name] === "object") {
      await mkdir(fullPath, { recursive: true });
      await createStructure(fullPath, obj[name]);
    } else {
      const exists = await fileExists(fullPath);
      if (!exists) {
        await writeFile(fullPath, obj[name]);
        console.log(`📄 Created file: ${fullPath}`);
      } else {
        console.log(`⚠️  Skipped (already exists): ${fullPath}`);
      }
    }
  }
}

// Run the script
createStructure(cwd(), structure)
  .then(() => console.log("✅ Folder structure created successfully!"))
  .catch((err) => console.error("❌ Error creating structure:", err));
