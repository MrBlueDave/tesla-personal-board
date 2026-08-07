#!/usr/bin/env bash
set -e

echo "=================================================="
echo "🚀 Tesla Personal Board - Automatic Installer"
echo "=================================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or v20+) before running this installer."
    exit 1
fi

# Check NPM
if ! command -v npm &> /dev/null; then
    echo "❌ NPM is not installed. Please install NPM before running this installer."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Detected Node.js version: $NODE_VERSION"

# Create data folder if missing
echo "📁 Ensuring data directory exists..."
mkdir -p data

# Initialize data/config.json if missing
if [ ! -f data/config.json ]; then
    echo "🔑 Creating default data/config.json..."
    cat << 'EOF' > data/config.json
{
  "masterPassword": "tesla"
}
EOF
fi

# Initialize data/user_profiles.json if missing
if [ ! -f data/user_profiles.json ]; then
    echo "👤 Creating default data/user_profiles.json..."
    cat << 'EOF' > data/user_profiles.json
{
  "activePin": "0000",
  "profiles": {
    "0000": {
      "pin": "0000",
      "name": "Default User",
      "catalog": [],
      "hiddenPresets": [],
      "favorites": [],
      "hiddenCategories": []
    }
  }
}
EOF
fi

# Fix permissions if running as root / Linux
if [ "$(id -u)" -eq 0 ]; then
    echo "🔒 Adjusting permissions for data directory..."
    chmod -R 777 data
fi

# Install dependencies
echo "📦 Installing NPM dependencies..."
npm install

# Build static assets
echo "🏗️ Building production assets..."
npm run build

echo ""
echo "=================================================="
echo "🎉 Setup completed successfully!"
echo "=================================================="
echo "To start the production server:"
echo "  npm start"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Default Master Password: tesla"
echo "=================================================="
