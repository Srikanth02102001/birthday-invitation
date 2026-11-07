interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

// Add your approved public IP addresses here
const ALLOWED_IPS = new Set([
  "106.192.0.238"
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {

    // Get visitor IP from Cloudflare
    const visitorIP = request.headers.get("CF-Connecting-IP");

    // Block unauthorized visitors
    if (!visitorIP || !ALLOWED_IPS.has(visitorIP)) {
      return new Response("403 - Access Denied HaHa open avadhuuu", {
        status: 403,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      });
    }

    // Allow approved visitors to access React website
    return env.ASSETS.fetch(request);
  }
};