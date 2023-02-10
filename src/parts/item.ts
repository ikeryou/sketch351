import vt from '../glsl/item.vert';
import fg from '../glsl/item.frag';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Vector3 } from 'three/src/math/Vector3';
import { DoubleSide } from 'three/src/constants';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import { MyObject3D } from "../webgl/myObject3D";
import { Func } from '../core/func';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Util } from '../libs/util';
import { MousePointer } from '../core/mousePointer';

export class Item extends MyObject3D {

  private _id: number;
  private _mesh: Mesh;
  private _noise: Vector3 = new Vector3()

  constructor(opt: {geo: SphereGeometry, id: number, total: number, scale: number}) {
    super();

    this._id = opt.id;
    this._noise.x = opt.scale;

    const radius = (1 / opt.total) * 0.5;
    const center = Util.instance.map(opt.id, -0.5, 0.5, 0, opt.total - 1);

    this._mesh = new Mesh(
      opt.geo,
      new ShaderMaterial({
        vertexShader:vt,
        fragmentShader:fg,
        transparent:true,
        // depthTest:false,
        side: DoubleSide,
        // wireframe: this._id % 2 == 0,
        uniforms:{
          color:{value:new Color(this._id % 9 == 0 ? 0xff0000 : (this._id % 2 == 0 ? 0x000000 : 0xffffff))},
          alpha:{value: 1},
          radius:{value: radius},
          center:{value: center},
        }
      })
    );
    this.add(this._mesh);

    this._noise.y = Util.instance.map(opt.id, 0, 360 * 1, 0, opt.total - 1);
    this._noise.z = Util.instance.map(opt.id, 0, 360 * 1, 0, opt.total - 1);

    // if(this._id % 2 == 0) this._mesh.visible = false;
  }

  protected _update():void {
    super._update();

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    const mx = MousePointer.instance.easeNormal.x;
    const my = MousePointer.instance.easeNormal.y;

    const s = Math.max(sw, sh) * 0.35 * Util.instance.map(mx, 1, this._noise.x, -1, 1);
    this._mesh.scale.set(s, s, s);

    const radisn = Util.instance.radian(my * 45);
    this._mesh.rotation.y = Util.instance.radian(Math.sin(radisn) * this._noise.z);
    this._mesh.rotation.x = Util.instance.radian(Math.sin(radisn) * this._noise.y);
  }
}