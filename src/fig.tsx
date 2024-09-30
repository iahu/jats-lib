import { useMemo } from 'react';
import xpath from 'xpath';
import { Alternatives } from './alternatives';
import { Graphic } from './graphic';
import { getAttrsMap, isNode, textContent } from './helper';
import { Props } from './interface';
import { Translate } from './translate';

export const Fig = (props: Props) => {
    const { node, baseUrl } = props;
    const attrsMap = getAttrsMap(node);

    const labelNode = useMemo(() => {
        const main = xpath.select1('./label', node);
        const sub = xpath.select1('./abstract/label', node);
        return main || sub;
    }, [node]);

    const captionNode = useMemo(() => {
        const main = xpath.select1('./caption', node);
        const sub = xpath.select1('./abstract/title', node);
        return main || sub;
    }, [node]);

    const alternativesNode = xpath.select1('./alternatives', node);
    const graphic = xpath.select1('.//graphic', node);

    return (
        <figure {...attrsMap} className="sec-figure">
            {isNode(alternativesNode) && <Alternatives node={alternativesNode} select="./*[@specific-use='big']"></Alternatives>}
            {isNode(graphic) && <Graphic node={graphic} baseUrl={baseUrl} zoom={1} />}
            <figcaption>
                {isNode(labelNode) && <strong>{textContent(labelNode)}</strong>}
                {isNode(captionNode) && <Translate node={captionNode} />}
            </figcaption>
        </figure>
    );
};
