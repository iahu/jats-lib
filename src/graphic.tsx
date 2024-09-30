import { useMemo } from 'react';
import xpath from 'xpath';
import { GraphicSource } from './graphic-source';
import { imageStateAttrs, isNode, parseAttrNumber } from './helper';
import { Props } from './interface';

export interface GraphicProps extends Props {
  zoom?: number;
  baseUrl?: string;
}

export const Graphic = (props: GraphicProps) => {
  const { className, node, zoom = 1, baseUrl = '' } = props;
  const piAttrs = imageStateAttrs(node);
  const siblings = (xpath.select(`../${node.nodeName}`, node) as Array<Node>)?.filter((x) => x !== node);

  const src = useMemo(() => {
    const _src = `${baseUrl}/${xpath.select1('string(@*[name()="xlink:href"])', node)?.toString()}`;
    const href = isNode(siblings?.[0]) ? xpath.select1('string(./@*[name()="xlink:href"])', siblings?.[0]) : '';

    const src = _src?.endsWith('.tif') || _src?.endsWith('.pdf') ? `${baseUrl}/${href}` : _src;
    return src;
  }, [baseUrl, node, siblings]);

  return (
    <picture>
      {siblings.map((s, i) => (
        <GraphicSource baseUrl={`${baseUrl}/`} key={`${i}.${(s as Node).nodeValue}`} node={s as Node} zoom={zoom} />
      ))}

      <img
        alt="pic"
        loading="lazy"
        className={['graphic', className].filter(Boolean).join(' ')}
        src={src}
        width={zoom * parseAttrNumber(piAttrs?.getNamedItem('width'))}
        height={zoom * parseAttrNumber(piAttrs?.getNamedItem('height'))}
        data-specific-use={xpath.select1('string(@specific-use)', node) || 'print'}
      />
    </picture>
  );
};
