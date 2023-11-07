export namespace DemoActionList {
    export interface DemoActionInfo {
        aname: string;
        desc?: any;
        fontSize?: string;
        btnHeight?: string;
        notTrigger?: boolean;
        initCall: (canvas: HTMLCanvasElement) => void;
        uninitCall: () => void;
    }
    const actionMap: Map<string, DemoActionInfo> = new Map();
    let _canvas: HTMLCanvasElement;
    let _curAction: DemoActionInfo;
    let _isdisplay: boolean = true;
    let _trigger: HTMLDivElement;
    let _root: HTMLDivElement;
    let _panel: HTMLDivElement;
    let _select: HTMLDivElement;
    let _width: number;
    export function registDemoAction(info: DemoActionInfo) {
        actionMap.set(info.aname, info);
        createBtn(info);
    }
    export function Init(canvas: HTMLCanvasElement, width?: number) {
        _width = width || 150;
        _canvas = canvas;
        createRoot();
        createTigger();
        createPanel();
    }
    function selectBtn(parent: HTMLDivElement) {
        if (!_select) {
            _select = document.createElement('div');
            _select.style.position = 'absolute';
            _select.style.top = '0';
            _select.style.left = '0';
            _select.style.width = '100%';
            _select.style.height = '100%';
            _select.style.backgroundColor = '#E16B8C';
            _select.style.zIndex = '0';
        }
        _select.remove();
        parent.appendChild(_select);
    }
    function createBtn(info: DemoActionInfo) {
        const text = document.createElement('span');
        text.textContent = info.desc;
        text.style.zIndex = '1000';
        text.style.position = 'absolute';
        text.style.fontSize = info.fontSize || '14px';

        const btn = document.createElement('div');
        btn.style.position = 'relative';
        btn.style.width = '100%';
        btn.style.height = info.btnHeight || '30px';
        btn.style.backgroundColor = '#fcc307';
        btn.style.borderColor = '#83a78d';
        btn.style.borderWidth = '0 0 2px 0';
        btn.style.borderStyle = 'solid';

        btn.appendChild(text);
        btn.addEventListener('pointerdown', () => {
            if (!_curAction || info.aname !== _curAction.aname) {
                try {
                    _curAction && _curAction.uninitCall && _curAction.uninitCall();
                    info && info.initCall && info.initCall(_canvas);

                    console.log(`${info.aname} 描述:`, info.desc);
                } catch (error) {
                    console.error(error);
                }
                _curAction = info;
                selectBtn(btn);
            } else {
                if (info.notTrigger) {
                    info && info.initCall && info.initCall(_canvas);
                }
            }
        });

        _panel.appendChild(btn);
    }
    function createPanel() {
        _panel = document.createElement('div');
        _panel.style.position = 'relative';
        _panel.style.width = '100%';
        _panel.style.height = 'calc(100% - 30px)';
        _panel.style.overflowX = 'hidden';
        _panel.style.overflowY = 'auto';
        _panel.style.backgroundColor = '#2f90b9';

        _root.appendChild(_panel);
    }
    function createTigger() {
        _trigger = document.createElement('div');
        _trigger.style.position = 'relative';
        _trigger.style.width = '100%';
        _trigger.style.height = '30px';
        _trigger.style.backgroundColor = '#f03f24';
        _trigger.innerText = "显示/隐藏";

        _trigger.addEventListener('pointerdown', () => {
            _isdisplay = !_isdisplay;
            _panel.style.display = _isdisplay ? 'block' : 'none';
        });

        _root.appendChild(_trigger);
    }
    function createRoot() {
        _root = document.createElement('div');
        _root.style.position = 'absolute';
        _root.style.width = `${_width}px`;
        _root.style.height = '100%';
        _root.style.backgroundColor = '#00000000';

        document.body.appendChild(_root);
    }
    export function getDemosinfo() {
        let result = ``;
        actionMap.forEach((v, k) => {
            result += `| ${v.aname} | ${v.desc} |\n`;
        });

        return result;
    }
}

(<any>window).getDemosinfo = DemoActionList.getDemosinfo;