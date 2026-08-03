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
    
    const featureMembers = xmlDoc.getElementsByTagName('gml:featureMember');
    const targetElement = featureMembers.length > 0 
      ? featureMembers[0] 
      : xmlDoc.querySelector('[class*="_layer"], [class*="_feature"]');

    if (!targetElement) {
      const rootChildren = xmlDoc.documentElement.children;
      if (rootChildren.length === 0) return null;
      
      for (let i = 0; i < rootChildren.length; i++) {
        const child = rootChildren[i];
        if (child.children.length > 0) {
          const featureObj = extractElementProperties(child.children[0]);
          if (Object.keys(featureObj).length > 0) return featureObj;
        }
      }
      return null;
    }

    const featureChild = targetElement.firstElementChild || targetElement;
    const properties = extractElementProperties(featureChild);
    
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
