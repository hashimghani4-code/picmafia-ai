# PicMafia AI

A luxury dark-themed AI profile picture and portrait creation engine tailored for creators across Instagram, TikTok, and corporate branding positions.

## 🚀 Deployment Instructions

### Option 1: Quick Continuous GitHub to Netlify Stream
1. **Create Repository:** Create a new GitHub repository and push this complete directory configuration structure cleanly.
2. **Connect Workspace:** Log into your [Netlify Workspace Dashboard](https://app.netlify.com/).
3. **Import Project:** Select **Add new site** -> **Import an existing project** -> Link to your target GitHub repository.
4. **App Configurations Setup:** Verify deployment paths match specifications mapped below instantly:
   - **Build command:** `npm run build`
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
5. **Set Environment Variables:** Go to **Site Configuration** -> **Environment variables** -> Add your secrets:
   - `OPENAI_API_KEY` = *[Your Private OpenAI Key here]*
   - `OPENAI_IMAGE_MODEL` = `gpt-image-1` *(or desired fallback models like dall-e-3)*
6. **Trigger Deployment:** Click **Deploy site**.

---

## 🛠 Local Environment Execution & Testing

To test and execute the ecosystem configuration parameters completely from local verification terminals:

1. Install global utility tools via dependencies installation configurations:
   ```bash
   npm install
   npm install -g netlify-cli
