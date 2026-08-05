/**
 * @file gmlPopupParser.ts
 * @directory src/models
 * @description Model phân tích cú pháp dữ liệu phản hồi WMS GetFeatureInfo dạng GML/XML từ MapServer.
 * 
 * Chức năng chính: Model Phân tích Cú pháp GML GetFeatureInfo (WMS GML Response Parser Model)
 * Các chức năng nhỏ:
 * - parseGMLResponse: Chuyển đổi chuỗi phản hồi XML/GML từ MapServer thành đối tượng JSON chứa thuộc tính đối tượng.
 */

export function parseGMLResponse(gmlText: string): Record<string, any> | null {
  if (!gmlText || !gmlText.trim()) return null;

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gmlText, 'text/xml');
    const allElements = Array.from(xmlDoc.querySelectorAll('*'));

    // 1. Tìm thẻ feature (_feature hoặc featureMember)
    let targetElement = allElements.find(el => {
      const tag = (el.localName || el.tagName || '').toLowerCase();
      return tag.endsWith('_feature') || tag === 'featuremember';
    });

    // 2. Nếu không thấy *_feature, tìm con bên trong *_layer
    if (!targetElement) {
      const layerElement = allElements.find(el => {
        const tag = (el.localName || el.tagName || '').toLowerCase();
        return tag.endsWith('_layer');
      });

      if (layerElement && layerElement.children.length > 0) {
        for (let i = 0; i < layerElement.children.length; i++) {
          const child = layerElement.children[i];
          const tag = (child.localName || child.tagName || '').toLowerCase();
          if (tag !== 'name' && tag !== 'boundedby' && !tag.includes('name')) {
            targetElement = child;
            break;
          }
        }
      }
    }

    if (!targetElement) return null;

    const properties = extractElementProperties(targetElement);
    if (Object.keys(properties).length === 0) return null;

    return properties;
  } catch (err) {
    console.warn('Lỗi phân tích cú pháp GML GetFeatureInfo:', err);
    return null;
  }
}

function extractElementProperties(element: Element): Record<string, any> {
  const props: Record<string, any> = {};
  const children = element.children;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const tagName = child.tagName.replace(/^.*:/, '');
    
    if (tagName === 'boundedBy' || tagName === 'outerBoundaryIs' || tagName === 'Point' || tagName === 'LineString' || tagName === 'Polygon') {
      continue;
    }

    if (child.children.length === 0 && child.textContent !== null) {
      props[tagName] = child.textContent.trim();
    }
  }

  if (element.tagName) {
    props['_layerName'] = element.tagName.replace(/^.*:/, '');
  }

  return props;
}
