import {XMLParser} from "fast-xml-parser";

export const xmlParser = new XMLParser(
    {
      ignoreAttributes: false,
      attributeNamePrefix: "",
      allowBooleanAttributes: true,
      htmlEntities: true,
      alwaysCreateTextNode: true,
      textNodeName: "textValue",
      transformAttributeName: (attributeName) => {
        if (attributeName === 'href') return 'textValue';
        return attributeName;
      },
      transformTagName: (tagName) => {
        if (tagName === 'description') return 'summary';
        if (tagName === 'pubDate') return 'published';
        if (tagName === 'entry') return 'item';
        return tagName;
      }
    })