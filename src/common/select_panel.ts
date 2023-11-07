
type SelectPanelInfo  = [string, () => void];

export namespace SelectPanel {
    const recycleList: [HTMLDivElement, HTMLSpanElement][] = [];
    const usingList: [HTMLDivElement, HTMLSpanElement][] = [];
    let root: HTMLDivElement;
    let content: HTMLDivElement;
    let infoList: SelectPanelInfo[];
    let downNode: HTMLDivElement;

    export function init(cfg: SelectPanelInfo[]) {
        infoList = cfg;

        createRoot();

        for (let i = 0, len = cfg.length; i < len; i++) {
            createInfo(cfg[i], i);
        }
    }

    export function uninit() {

        recycle();

        if (root) {
            root.style.display = 'none';
        }
        infoList = undefined;
    }

    function getInfo(i: number) {
        return infoList[i];
    }

    function createRoot() {
        if (!root) {
            const rootWidth = 300;
            root = document.createElement('div');
            root.style.position = 'absolute';
            root.style.width = `${rootWidth}px`;
            root.style.height = '100%';
            root.style.right = '0';
            // root.style.top = '50%';
            // root.style.transform = 'translateY(-50%)';
            root.style.backgroundColor = '#55555566';
            root.style.overflowX = 'auto';
            root.style.overflowY = 'auto';
            root.style.zIndex = '99999999';
            root.style.color = '#fbda41';

            content = document.createElement('div');
            content.style.position = 'absolute';
            content.style.top = '0px';
            content.style.width = '100%';
            content.style.height = 'auto';

            root.appendChild(content);
        }

        root.style.display = 'block';

        document.body.appendChild(root);
    }

    function createInfo(info: SelectPanelInfo, index: number) {
        let nodes: [HTMLDivElement, HTMLSpanElement];
        let div: HTMLDivElement, span: HTMLSpanElement;
        nodes = recycleList.pop();
        const btnSize = 20;

        if (!nodes) {
            div = document.createElement('div');
            div.style.backgroundColor = 'transparent';
            div.style.borderWidth = '1px 0';
            div.style.borderColor = '#134857';
            div.style.borderStyle = 'double';
            div.style.width = '100%';
            div.style.height = '30px';

            span = document.createElement('span');
            span.style.display = 'block';
            span.style.width = '100%';
            span.style.height = '50%';


            div.appendChild(span);

            div.addEventListener('pointerdown', (e: PointerEvent) => {

                e.preventDefault();

                if (downNode) {
                    downNode.style.backgroundColor = 'transparent';
                }

                div.style.backgroundColor = '#E16B8C55';

                downNode = div;
                const tempIndex = (<any>div.getAttribute("index")) - 0;
                getInfo(tempIndex)[1]();

            });

            nodes = [div, span];
        } else {
            [div, span] = nodes;

        }

        div.setAttribute('index', `${index}`);
        content.appendChild(div);
        usingList.push(nodes);

        span.textContent = !info ? 'undefined' : info[0];
    }

    function recycle() {
        const len = usingList.length
        for (let i = len - 1; i >= 0; i--) {
            usingList[i][0].remove();
            recycleList.push(usingList[i]);
        }
        usingList.length = 0;
    }
}