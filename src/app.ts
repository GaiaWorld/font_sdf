import { SdfContext } from "./sdf/draw_sdf";
import { set_gl } from "./sdf/glyph";
import { DrawText } from "./draw_text"
import { DataPanel } from "common/data_panel";
import { mat4 } from "gl-matrix";

document.addEventListener('DOMContentLoaded', (_) => {
    if (document === null) {
        alert("Failed to get document!");
        return;
    }

    let c = document.getElementById('sdf-canvas') as HTMLCanvasElement;
    if (!c) {
        alert("Failed to get sdf-canvas!");
        return;
    }
    let sdfContext = new SdfContext(c);
    set_gl(sdfContext.gl);
    sdfContext.draw();

    c = document.getElementById('font-canvas') as HTMLCanvasElement;
    if (!c) {
        alert("Failed to get font-canvas!");
        return;
    }
    let fontCanvas = c;
    const fontContext = fontCanvas.getContext('2d');
    if (!fontContext) {
        alert("Failed to get font-canvas context!");
        return;
    }

    fontCanvas.addEventListener('mousedown', (event) => {
        let rect = fontCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        if (dt) {
            dt.set_mouse_down(x, y);
            dt.draw();
            afterDraw();
        }
    });

    const arcCountElement = document.getElementById('arc_count') as HTMLElement;

    const setArcCount = (value: number) => {
        if (arcCountElement) {
            arcCountElement.innerHTML = value.toString();
        }
    }

    const bezierCountElement = document.getElementById('bezier_count') as HTMLElement;
    const setBezierCount = (value: number) => {
        if (bezierCountElement) {
            bezierCountElement.innerHTML = value.toString();
        }
    }

    const dataTexturePixelsElement = document.getElementById('data_texture_pixels') as HTMLElement;
    const setDataTexturePixel = (show: string) => {
        if (dataTexturePixelsElement) {
            dataTexturePixelsElement.innerHTML = show;
        }
    }

    let dt = new DrawText(fontContext, window.location.search.replace("?", "") || "hwxw.ttf");

    const afterDraw = () => {
        setTimeout(() => {
            sdfContext.setChar(dt.get_char());

            setArcCount(dt.get_arc_count());
            setBezierCount(dt.get_bezier_count());
            setDataTexturePixel(dt.get_blob_string());
        }, 1);
    };

    const debugElement = document.getElementById('debug') as HTMLInputElement;
    if (debugElement) {
        debugElement.addEventListener('change', function() {
            const debugDiv = document.getElementById("debug_canvas");
            if (debugDiv) {
                debugDiv.style.display = debugElement.checked ? "block" : "none";
            }
        });
    }

    const charElement = document.getElementById('char') as HTMLInputElement
    const charValue = charElement ? charElement.value : "A";
    dt.set_char(charValue);
    charElement.addEventListener('input', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_char(target.value);
        dt.draw();

        afterDraw();
    });

    const convertInputToNumber = (inputValue: string) => {
        if (!/^\d+$/.test(inputValue)) {
            console.warn(`警告: 大小设置，输入不完全是数字，value = ${inputValue}`);
            return -1;
        }

        return Number(inputValue);
    }

    // const charSizeElement = document.getElementById('char_size') as HTMLInputElement
    // const charSizeValue = charSizeElement ? charSizeElement.value : "64";
    // let size = convertInputToNumber(charSizeValue);
    // if (size > 0) {
    //     dt.set_char_size(size);
    // }
    // charSizeElement.addEventListener('input', function (event) {
    //     let target = event.target as HTMLInputElement;
    //     let size = convertInputToNumber(target.value);
    //     if (size > 0) {
    //         dt.set_char_size(size);
    //     }
    //     dt.draw();
    //     afterDraw();
    // });

    const bezierRenderElement = document.getElementById('isBezierRender') as HTMLInputElement
    const isBezierRender = bezierRenderElement ? bezierRenderElement.checked : false;
    dt.set_render_bezier(isBezierRender);
    bezierRenderElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_render_bezier(target.checked);
        dt.draw();

        afterDraw();

    });

    const bezierFillElement = document.getElementById('bezierFill') as HTMLInputElement;
    const isBezierFill = bezierFillElement ? bezierFillElement.checked : false;
    dt.set_bezier_fill(isBezierFill);
    bezierFillElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_bezier_fill(target.checked);
        dt.draw();

        afterDraw();

    });

    const bezierStrokeElement = document.getElementById('bezierStroke') as HTMLInputElement;
    bezierStrokeElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_bezier_fill(!target.checked);
        dt.draw();

        afterDraw();
    });

    const bezierEndpointsElement = document.getElementById('bezierEndpoints') as HTMLInputElement;
    const bezierEndpoints = bezierEndpointsElement ? bezierEndpointsElement.checked : false;
    dt.set_bezier_endpoints(bezierEndpoints);
    bezierEndpointsElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_bezier_endpoints(target.checked);
        dt.draw();

        afterDraw();
    });

    const arcRenderElement = document.getElementById('isArcRender') as HTMLInputElement
    const isArcRender = arcRenderElement ? arcRenderElement.checked : false;
    dt.set_render_arc(isArcRender);
    arcRenderElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_render_arc(target.checked);
        dt.draw();

        afterDraw();
    });

    const arcFillElement = document.getElementById('arcFill') as HTMLInputElement;
    const isArcFill = arcFillElement ? arcFillElement.checked : false;
    dt.set_arc_fill(isArcFill);
    arcFillElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_arc_fill(target.checked);
        dt.draw();

        afterDraw();
    });

    const arcStrokeElement = document.getElementById('arcStroke') as HTMLInputElement;
    arcStrokeElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_arc_fill(!target.checked);
        dt.draw();

        afterDraw();
    });

    const arcEndpointsElement = document.getElementById('arcEndpoints') as HTMLInputElement;
    const arcEndpoints = arcEndpointsElement ? arcEndpointsElement.checked : false;
    dt.set_arc_endpoints(arcEndpoints);
    arcEndpointsElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_arc_endpoints(target.checked);
        dt.draw();

        afterDraw();
    });

    const networkRenderElement = document.getElementById('grid') as HTMLInputElement
    const isNetworkRender = networkRenderElement ? networkRenderElement.checked : false;
    dt.set_render_network(isNetworkRender);
    networkRenderElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_render_network(target.checked);
        dt.draw();

        afterDraw();
    });

    const sdfRenderElement = document.getElementById('isSDFRender') as HTMLInputElement
    const isSDFRender = sdfRenderElement ? sdfRenderElement.checked : false;
    dt.set_render_sdf(isSDFRender);
    networkRenderElement.addEventListener('change', function (event) {
        let target = event.target as HTMLInputElement;
        dt.set_render_sdf(target.checked);
        dt.draw();

        afterDraw();
    });

    dt.set_init_pos(300, 2100);
    dt.set_init_size(fontCanvas.width, fontCanvas.height);
    dt.draw();

    afterDraw();
});

declare var window: any;
export class Action {
    static fontSize(v: number) {
        if (window.material) {
            let m = mat4.create();
            mat4.identity(m);
            mat4.translate(m, m, [25.0, 120.0, 0.0]);
            mat4.scale(m, m, [v, v, 1.]);
            window.material?.setWorldMatrix(m);
        }
    }
    static TexOffset(v: number) {

    }
    static vertexOffsetX(v: number) {

    }
    static vertexOffsetY(v: number) {

    }
    static faceColorR(v: number) {
        
    }
    static faceColorG(v: number) {

    }
    static faceColorB(v: number) {

    }
    static outlineWidth(v: number) {
        if (window.material) {
            window.material.outline[0] = 0.2;
            window.material.outline[1] = 0.9;
            window.material.outline[2] = 0.2;
            window.material.outline[3] = v;
        }
    }
    static outlineSoftness(v: number) {
        if (window.material) {
            window.material.weightAndOffset[3] = v;
        }
    }
    static weightNormal(v: number) {

    }
    static weightBold(v: number) {
        if (window.material) {
            window.material.weightAndOffset[0] = v;
        }
    }
    static lineSize(v: number) {

    }
    static lineOffset(v: number) {

    }
    static gradientAngle(v: number) {
        let gradientExtendSize = Math.sqrt(2);
        let gradientRadius = 45 / 180 * Math.PI;
        gradientRadius = v / 180 * Math.PI;

        let x0 = -Math.cos(gradientRadius) * gradientExtendSize / 2;
        let y0 = -Math.sin(gradientRadius) * gradientExtendSize / 2;
        let x1 = -x0;
        let y1 = -y0;

        if (window.material) {
            window.material.uGradientStartEnd[0] = x0 + 0.5;
            window.material.uGradientStartEnd[1] = y0 + 0.5;
            window.material.uGradientStartEnd[2] = x1 + 0.5;
            window.material.uGradientStartEnd[3] = y1 + 0.5;
        }
    }
    static gradientExtend(v: number) {
    }
    static edgeControl(v: number) {
        if (window.material) {
            window.material.weightAndOffset[2] = v;
        }
    }
}

DataPanel.init([
    // [`是否规范规定罐蟹试卷`, 1.0, (v) => { v }, 2, 3],
    [`fontSize`, 60.0, Action.fontSize, 10, 440.0],
    // [`TexOffset`, 0.25, Action.TexOffset, 0.0, 0.58],

    // [`vertexOffsetX`, 0, Action.vertexOffsetX, -1, 1.0],
    // [`vertexOffsetY`, 0, Action.vertexOffsetY, -1.0, 1.0],

    // [`faceColor.r`, 1.0, Action.faceColorR, 0.0, 1.0],
    // [`faceColor.g`, 1.0, Action.faceColorG, 0.0, 1.0],
    // [`faceColor.b`, 1.0, Action.faceColorB, 0.0, 1.0],
    [`edgeControl`, 0.5, Action.edgeControl, 0.0, 1.0],

    [`outlineWidth`, 0.0, Action.outlineWidth, 0.0, 32.0],
    [`outlineSoftness`, 0, Action.outlineSoftness, 0, 1.0],

    // [`weightNormal`, 0, Action.weightNormal, -2, 2.0],
    [`weightBold`, 0.0, Action.weightBold, -3, 3],

    // [`lineSize`, 0.0, Action.lineSize, 0.0, 1.0],
    // [`lineOffset`, 0.0, Action.lineOffset, 0.0, 1.0],
    // [`gradientStartX`, 0.0, gradientStartX, -1.0, 1.0],
    // [`gradientStartY`, 0.0, gradientStartY, -1.0, 1.0],
    // [`gradientEndX`, 1.0, gradientEndX, -1.0, 1.0],
    // [`gradientEndY`, 1.0, gradientEndY, -1.0, 1.0],
    // ['方向角度', 0,     (v) => { _DirectionalBlur.angle = v }, 0, 360],
    [`gradientAngle`, 45, Action.gradientAngle, -180, 180],
    // [`gradientExtend`, 0, Action.gradientExtend, 0, Math.sqrt(2)],
], `100%`);
