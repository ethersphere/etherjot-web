## Setup

1. Execute: `npm install` (Only once)
2. Start the application: `npm start`

## Testing with `bee`

Ensure you have `bee` version `1.16.1` for compatibility with `dev` mode.

1. Download `bee` from [this link](https://github.com/ethersphere/bee/releases/tag/v1.16.1).
2. Provide execution permissions: `chmod +x <downloaded_binary_name>`
3. Initiate: `./bee dev --cors-allowed-origins="*"`
4. Generate a postage batch using: `curl -X POST http://localhost:1635/stamps/100000000/24`
