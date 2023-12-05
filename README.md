# Etherjot Web blogging tool

Etherjot is a demo web3 blog-publishing application built on the Swarm network.

## Swarm network

Swarm is a peer-to-peer network of Bee nodes that collectively provide censorship resistant decentralised storage and communication services.

## Screenshots

![Editor](docs/screenshot-editor.png)
![Blog](docs/screenshot-blog.png)

## Features

-   Markdown editor
-   Categories and tags for organizing content
-   Built-in asset browser and management
-   Publishing directly on decentralised storage
-   Configurable elements like header, footer and main page layout
-   Extension: Donation component to accept tips and topups
-   Extension: Decentralised commenting

Most of the implementation is available in the core library [Libetherjot](https://github.com/ethersphere/libetherjot).

## Setup

### Recommended

Etherjot is available as part of [Swarm Desktop](https://github.com/ethersphere/swarm-desktop). Get it from `https://desktop.ethswarm.org`.

### Manual

1. `git clone` this repository
2. Run `npm install`
3. Run `npm start`

### Testing with `bee dev`

Ensure you have `bee` version `1.16.1` for compatibility with `dev` mode.

1. Download `bee` from [this link](https://github.com/ethersphere/bee/releases/tag/v1.16.1).
2. Provide execution permissions: `chmod +x <downloaded_binary_name>`
3. Initiate: `./bee dev --cors-allowed-origins="*"`
4. Generate a postage batch using: `curl -X POST http://localhost:1635/stamps/100000000/24`

## Extensions

Etherjot features two Swarm-native web components as extensions:

1. [Swarm Comments](https://github.com/ethersphere/comment-system-ui)
2. [Swarm Donations](https://github.com/ethersphere/swarm-donation)
