import { OpenAI } from 'openai';

export const handler = async (event, context) => {
  // CORS setup parameters
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Intercept Preflight Request Options prechecks
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Reject anything that is not a POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing request payload body.' }) };
    }

    const { prompt, style, size } = JSON.parse(event.body);

    // Backend Form Validation rules
    if (!prompt || !prompt.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'A text prompt payload parameter is required.' }) };
    }

    if (prompt.length > 1000) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Prompt length can not exceed 1000 characters limit safety check.' }) };
    }

    // Guarding API implementation setup verification 
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ error: 'Server initialization error: Missing OpenAI API backend credential configurations.' }) 
      };
    }

    // Resolving model defaults using gpt-image-1 as requested fallbacks
    const selectedModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

    const openai = new OpenAI({ apiKey });

    // Compound high quality professional custom tailored instruction engineering injection injection layer
    const compoundPrompt = `High luxury premium profile photo showcase portrait matching style '${style}'. Content details: ${prompt}. Cinematic lighting, ultra-sharp details, elegant upscale presentation.`;

    // Forward call payload request parameters across downstream channels execution pipelines 
    const response = await openai.images.generate({
      model: selectedModel,
      prompt: compoundPrompt,
      n: 1,
      size: size || '1024x1024',
      response_format: 'url' // Can toggle cleanly to b64_json alternative configurations if required
    });

    const resultUrl = response.data[0]?.url;
    if (!resultUrl) {
      throw new Error('DALL-E engine processed application instruction successfully but payload failed returning output media channels asset arrays targets.');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: resultUrl })
    };

  } catch (error) {
    console.error('Core generation logic pipeline block breakdown failure details logging:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'An error process exception interruption occurred structural pipeline execution.' })
    };
  }
};
