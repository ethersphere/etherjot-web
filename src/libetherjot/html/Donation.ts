export async function createDonationButton(ethereumAddress: string, stamp: string) {
    return `
    <div id="donation"></div>
    <script src="https://cdn.jsdelivr.net/npm/swarm-donation@4.0.0"></script>
    <script>
        renderSwarmDonation('donation', '${ethereumAddress}', '${stamp}')
    </script>
    `
}
