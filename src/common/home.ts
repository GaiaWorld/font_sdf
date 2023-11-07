import { DemoActionList } from "../common/demo_action_list";

export namespace DemoActionHome {
    export function init(canvas: HTMLCanvasElement) {
        DemoActionList.registDemoAction({
            aname: 'home',
            desc: `返回首页 - (${canvas.width}-${canvas.height})`,
            initCall,
            uninitCall
        });

        function initCall(canvas: HTMLCanvasElement) {
            open('./index.html', '_self');
        }
        function uninitCall() {
        }
    }
}