export function renderNewsletterHTML(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'hero':
        return `
          <div style="padding: 20px; text-align: center; background-color: #FFFFFF; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif;">
            ${block.props.image?.trim() ? `<img src="${block.props.image.trim()}" alt="${block.props.title || 'Image'}" style="max-width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ''}
            <h1 style="font-size: 24px; font-weight: 800; color: #222222; margin: 0 0 8px 0;">${block.props.title || 'Hero Title'}</h1>
            ${block.props.subtitle ? `<p style="font-size: 16px; color: #666666; margin: 0;">${block.props.subtitle}</p>` : ''}
          </div>
        `;
      case 'cta':
        return `
          <div style="text-align: center; margin: 20px 0; font-family: sans-serif;">
            <a href="${block.props.link || '#'}" style="background-color: #D4AF37; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              ${block.props.text || 'Click Here'}
            </a>
          </div>
        `;
      case 'meal_list':
        const itemsHtml = (block.props.items || []).map((meal: any) => `
          <div style="display: flex; margin-bottom: 15px; border-bottom: 1px solid #EEEEEE; padding-bottom: 15px; font-family: sans-serif;">
            ${meal.image?.trim() ? `<img src="${meal.image.trim()}" alt="${meal.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;" />` : `<div style="width: 80px; height: 80px; border-radius: 8px; background-color: #F2F2F2; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">No Image</div>`}
            <div style="padding-left: 15px;">
              <h3 style="font-size: 18px; font-weight: 600; color: #222222; margin: 0 0 5px 0;">${meal.name || 'Meal Name'}</h3>
              <p style="font-size: 16px; font-weight: bold; color: #D4AF37; margin: 0;">${meal.price || '$0.00'}</p>
            </div>
          </div>
        `).join('');
        return `<div style="padding: 10px 0; margin-bottom: 20px;">${itemsHtml}</div>`;
      case 'text':
        return `
          <div style="padding: 20px; font-family: sans-serif; color: #222222; line-height: 1.6; background-color: #FFFFFF; border-radius: 8px;">
            ${block.props.content || 'Text content goes here...'}
          </div>
        `;
      default:
        return `<div style="padding: 10px; border: 1px dashed red; color: red;">Unknown block type: ${block.type}</div>`;
    }
  };

  const blocksHtml = blocks.map(renderBlock).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background-color: #F2F2F2; margin: 0; padding: 20px;">
        <div style="background-color: #FFFFFF; margin: 0 auto; padding: 20px; max-width: 600px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          ${blocksHtml}
        </div>
      </body>
    </html>
  `;
}
